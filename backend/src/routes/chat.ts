import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import saveMsg from '../utils/save';

// delete in the future
const GEMINI_API_KEY = 'AIzaSyC-rE0Ggpz0AlNeYVC3aoJXBmz2j2YS9eI';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const router = Router();

router.post('/:id', async (req, res, next) => {
    try {
        const userId = req.userId;
        const message = req.body.message;
        const chatId = req.params.id;

        let generated = '';

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        const response = await ai.models.generateContentStream({
            model: 'gemini-2.0-flash-001',
            contents: `${message}`,
        });

        for await (const chunk of response) {
            generated += chunk.text;
            res.write(
                `data: ${JSON.stringify({
                    chunk: chunk.text,
                    finished: false,
                })}\n\n`
            );
        }

        const savedChatId = await saveMsg(
            chatId,
            userId || '',
            message,
            generated
        );
        if (!savedChatId) {
            res.status(500).json({
                message: 'Failed to save chat',
            });
            return;
        }

        res.write(
            `data: ${JSON.stringify({
                entire_msg: generated,
                finished: true,
                chatId: savedChatId,
            })}\n\n`
        );
        res.end();
    } catch (e: any) {
        console.log(e);
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});

export default router;
