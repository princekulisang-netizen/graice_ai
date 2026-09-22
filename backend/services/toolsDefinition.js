export const availableTools = [
    {
        type: "function",
        function: {
            name: "getCurrentTime",
            description: "Mendapatkan waktu dan tanggal saat ini.",
            parameters: {
                type: "object",
                properties: {},
                required: []
            }
        }
    },
    {
        type: "function",
        function: {
            name: "calculateProfitLoss",
            description: "Menghitung potensi keuntungan atau kerugian berdasarkan modal dan harga jual.",
            parameters: {
                type: "object",
                properties: {
                    capital: {
                        type: "number",
                        description: "Modal awal atau harga beli."
                    },
                    sellPrice: {
                        type: "number",
                        description: "Harga jual saat ini."
                    },
                    quantity: {
                        type: "number",
                        description: "Jumlah unit atau aset."
                    }
                },
                required: ["capital", "sellPrice", "quantity"]
            }
        }
    }
];

// Fungsi eksekusi lokal (implementasi nyata dari tools di atas)
export function executeTool(toolName, args) {
    if (toolName === "getCurrentTime") {
        return JSON.stringify({ currentTime: new Date().toLocaleString() });
    }

    if (toolName === "calculateProfitLoss") {
        const { capital, sellPrice, quantity } = args;
        const totalCapital = capital * quantity;
        const totalRevenue = sellPrice * quantity;
        const profitLoss = totalRevenue - totalCapital;
        const percentage = (profitLoss / totalCapital) * 100;

        return JSON.stringify({
            totalCapital,
            totalRevenue,
            profitLoss,
            percentage: percentage.toFixed(2) + "%",
            status: profitLoss >= 0 ? "Profit" : "Loss"
        });
    }

    return JSON.stringify({ error: "Tool tidak ditemukan." });
}