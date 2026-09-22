import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AIModelResponse } from '../models/ai-model';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    private baseUrl = 'http://localhost:3000/api/ai';

    constructor(private http: HttpClient) { }

    getAiModels(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/models`);
    }

    sendMessage(model: string, prompt: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/chat`, { model, prompt });
    }

    getModels(): Observable<AIModelResponse> {
        return this.http.get<AIModelResponse>(`${this.baseUrl}/models`);
    }
    
}