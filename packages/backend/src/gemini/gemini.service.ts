import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ChatSession, GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI } from 'src/constants/version';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeminiService {
    private genAI: GoogleGenerativeAI;
    private model: any;

    constructor(private configService: ConfigService) {
        // Lấy API Key từ file .env
        const apiKey = this.configService.get<string | null>('GEMINI_API_KEY') || '';
        this.genAI = new GoogleGenerativeAI(apiKey);

        // Cấu hình model (Gemini 1.5 Flash là bản miễn phí tốt nhất)
        this.model = this.genAI.getGenerativeModel({
            model: GEMINI,
        });
    }

    async *getChatStream(userPrompt: string, history: { role: string, parts: { text: string }[] }[] = []) {
        try {
            const chat = this.model.startChat({
                history: history,
                generationConfig: {
                    maxOutputTokens: 2000,
                    temperature: 0.7,
                },
            });
            const result = await chat.sendMessageStream(userPrompt);
            for await (const chunk of result.stream) {
                yield chunk.text();
            }
        } catch (error) {
            console.error('Gemini Error:', error);
            throw new InternalServerErrorException('Lỗi khi kết nối với AI');
        }
    }
}