import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { availableTools, executeTool } from './toolsDefinition.js';
dotenv.config();

export async function callLLMAgentWithMemory(modelName, dbMessages, userPrompt) {
    const apiKey = process.env.ORCA_API_KEY;

    const systemInstruction = {
        role: "system",
        content: "Kamu adalah Goblin AI, agen otonom yang analitis, tegas, dan logis. Jika sebuah tugas membutuhkan data eksternal, gunakan tool yang tersedia secara berurutan hingga tugas selesai dan berikan analisis yang tajam."
    };

    const messages = [
        systemInstruction,
        ...dbMessages.map(msg => ({
            role: msg.role,
            content: msg.content,
            ...(msg.tool_calls && { tool_calls: msg.tool_calls }),
            ...(msg.tool_call_id && { tool_call_id: msg.tool_call_id }),
            ...(msg.name && { name: msg.name })
        })),
        { role: "user", content: userPrompt }
    ];

    let maxSteps = 5; // Batas maksimal loop agar tidak infinite loop
    let currentStep = 0;

    while (currentStep < maxSteps) {
        currentStep++;

        // PERBAIKAN: Menambahkan /chat/completions pada endpoint OrcaRouter
        const response = await fetch("https://api.orcarouter.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelName || "gpt-4o-mini",
                messages: messages,
                tools: availableTools,
                tool_choice: "auto"
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || "Gagal terhubung ke LLM.");

        const choice = data.choices[0];
        const responseMessage = choice.message;

        // Jika AI tidak memanggil tool lagi, berarti tugas selesai (Final Answer)
        if (!responseMessage.tool_calls || responseMessage.tool_calls.length === 0) {
            return responseMessage.content;
        }

        // Jika AI memanggil tool, masukkan pesan asisten ke dalam array memori sementara
        messages.push(responseMessage);

        // Eksekusi semua tool yang diminta oleh AI pada iterasi ini
        for (const toolCall of responseMessage.tool_calls) {
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);

            console.log(`[ReAct Step ${currentStep}] Agent memanggil tool: ${functionName}`, functionArgs);

            const toolResult = executeTool(functionName, functionArgs);

            // Masukkan hasil observasi tool ke dalam memori pesan
            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                name: functionName,
                content: toolResult
            });
        }
        // Loop akan berlanjut ke iterasi berikutnya agar AI bisa menganalisis hasil tool
    }

    return "Maaf, agent mencapai batas maksimal langkah pemikiran (loop limit) tanpa menyelesaikan tugas.";
}