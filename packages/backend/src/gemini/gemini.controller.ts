import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { GeminiService } from './gemini.service';

@Controller('chat-gemini')
export class GeminiController {
    constructor(private readonly geminiService: GeminiService) { }

    @Post('stream')
    async streamChat(
        @Body() body: { prompt: string; history: any[] },
        @Res() res: Response,
    ) {
        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            for await (const chunk of this.geminiService.getChatStream(body.prompt, body.history)) {
                res.write(`data: ${chunk}\n\n`);
            }
            res.write('\ndata \n\n');
            res.end();
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('AI Error');
        }
    }
}
