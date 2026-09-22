import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    role: { type: String, required: true }, // 'user', 'assistant', 'system', 'tool'
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true, index: true },
    messages: [messageSchema]
}, { timestamps: true });

export default mongoose.model('ChatSession', chatSessionSchema);