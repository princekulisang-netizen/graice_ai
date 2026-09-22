import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ChatSession from './models/ChatSession.js';
import { callLLMAgentWithMemory } from './services/aiService.js';
import orcaClient from './src/config/orcaClient.js'; // Pastikan path ini sesuai dengan posisi file orcaClient.js Anda

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/goblin-ai";

// Koneksi ke MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log("Terhubung ke MongoDB"))
    .catch(err => console.error("Gagal koneksi MongoDB:", err));

// ==========================================
// 1. Endpoint untuk Menarik Model secara Dinamis
// ==========================================
app.get('/api/models', async (req, res) => {
    try {
        const response = await orcaClient.get('/models');
        res.json(response.data);
    } catch (error) {
        console.error("Gagal memuat model dari OrcaRouter:", error.message);
        res.status(500).json({ error: 'Gagal memuat daftar model dari provider' });
    }
});

// ==========================================
// 2. Endpoint Chat dengan Long-Term Memory
// ==========================================
app.post('/api/chat', async (req, res) => {
    try {
        const { sessionId, model, prompt } = req.body;

        if (!sessionId || !prompt) {
            return res.status(400).json({ error: "sessionId dan prompt wajib diisi!" });
        }

        // Cari atau buat sesi chat baru di database
        let session = await ChatSession.findOne({ sessionId });
        if (!session) {
            session = new ChatSession({ sessionId, messages: [] });
        }

        // Jalankan logika AI agent dengan memori dari database
        const aiReply = await callLLMAgentWithMemory(model, session.messages, prompt);

        // Simpan pesan baru (User & Assistant) ke dalam database
        session.messages.push({ role: 'user', content: prompt });
        session.messages.push({ role: 'assistant', content: aiReply });
        await session.save();

        res.json({ reply: aiReply, history: session.messages });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend Goblin AI berjalan di http://localhost:${PORT}`);
});