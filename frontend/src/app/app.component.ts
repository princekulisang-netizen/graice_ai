import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from './services/ai.service';
import { AIModel } from './models/ai-model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userPrompt: string = '';
  selectedModel: string = 'gpt-4o-mini';
  chatHistory: { sender: string; text: string }[] = [];
  isLoading: boolean = false;
  sessionId: string = '';

  // Properti tambahan untuk mode seleksi dan penghapusan pesan
  isSelectionMode: boolean = false;
  selectedChatIndices: Set<number> = new Set<number>();

  models: AIModel[] = [];

  constructor(private aiService: AiService) {}

  ngOnInit(): void {
    let storedSession = localStorage.getItem('goblin_session_id');
    if (!storedSession) {
      storedSession = 'session_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('goblin_session_id', storedSession);
    }
    this.sessionId = storedSession;
    this.loadModels();
  }

  private loadModels(): void {
    this.aiService.getModels().subscribe({
      next: (response) => {
        this.models = response.data || [];
        if (this.models.length > 0) {
          this.selectedModel = this.models[0].id;
        }
      },
      error: (error) => {
        console.error('Gagal memuat daftar model:', error);
        this.models = [];
      }
    });
  }

  // Fungsi untuk menandai atau batal menandai index chat tertentu
  toggleSelection(index: number): void {
    if (this.selectedChatIndices.has(index)) {
      this.selectedChatIndices.delete(index);
    } else {
      this.selectedChatIndices.add(index);
    }
  }

  // Fungsi untuk menghapus chat yang dipilih berdasarkan index
  deleteSelectedChats(): void {
    this.chatHistory = this.chatHistory.filter((_, index) => !this.selectedChatIndices.has(index));
    this.selectedChatIndices.clear();
    this.isSelectionMode = false;
  }

  onSend():void {
    if (!this.userPrompt.trim() || this.isLoading) return;

    const promptToSend = this.userPrompt;
    this.chatHistory.push({ sender: 'user', text: promptToSend });
    this.userPrompt = '';
    this.isLoading = true;

    this.aiService.sendMessage(this.selectedModel, promptToSend).subscribe({
      next: (res) => {
        this.chatHistory.push({ sender: 'ai', text: res.reply });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.chatHistory.push({ sender: 'ai', text: 'Terjadi kesalahan pada sistem agent.' });
        this.isLoading = false;
      }
    });
  }
}