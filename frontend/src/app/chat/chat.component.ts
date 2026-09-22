import { Component, OnInit } from '@angular/core';
import { AiService } from '../services/ai.service';
import { AIModel } from '../models/ai-model';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
    models: AIModel[] = [];
    selectedModel: string = '';

    // TAMBAHKAN DEKLARASI INI AGAR TIDAK ERROR
    userInput: string = '';
    messages: { sender: string; text: string }[] = [];
    isLoading: boolean = false;

    constructor(private aiService: AiService) { }

    ngOnInit(): void {
        this.loadModels();
    }

    loadModels(): void {
        this.aiService.getModels().subscribe({
            next: (response) => {
                this.models = response.data || [];
                if (this.models.length > 0) {
                    this.selectedModel = this.models[0].id;
                }
            },
            error: (err) => {
                console.error('Gagal memuat daftar model:', err);
            }
        });
    }

    onSendMessage(): void {
        if (!this.userInput.trim() || this.isLoading) return;

        const promptText = this.userInput;
        const currentModel = this.selectedModel;

        // 1. Tampilkan pesan user ke antarmuka chat
        this.messages.push({ sender: 'Anda', text: promptText });
        this.userInput = ''; // Kosongkan input
        this.isLoading = true;

        // 2. Panggil method sendMessage dari AiService
        this.aiService.sendMessage(currentModel, promptText).subscribe({
            next: (response) => {
                const aiReply = response.reply || response.message || JSON.stringify(response);

                // 3. Tampilkan jawaban AI ke antarmuka chat
                this.messages.push({ sender: 'Goblin AI', text: aiReply });
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Terjadi kesalahan saat mengirim pesan:', err);
                this.messages.push({ sender: 'Sistem', text: 'Terjadi kesalahan pada sistem agent.' });
                this.isLoading = false;
            }
        });
    }
}