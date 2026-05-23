import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  app.use(express.json());

  // Check if GEMINI_API_KEY is present
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // AI-Assisted Strategy Analysis Endpoint
  app.post('/api/gemini/analyze', async (req, res) => {
    try {
      if (!ai) {
        return res.status(400).json({
          error: 'โปรดตั้งค่า GEMINI_API_KEY ใน Settings > Secrets ของแอปพลิเคชัน',
        });
      }

      const { prompt } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'ต้องการข้อมูลสรุปการเทรด' });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'คุณคือผู้เชี่ยวชาญด้านจิตวิทยาและการเทรด Forex (Forex Trading & Psychology Coach) หน้าที่ของคุณคือการวิเคราะห์ประวัติการเทรดและให้คำแนะนำในการปรับปรุงกลยุทธ์ อัตราความเสี่ยง และจิตวิทยาการเทรดเป็นภาษาไทยที่สุภาพ เป็นมืออาชีพ อ้างอิงสถิติตัวเลขจากกลยุทธ์ แยกแยะจุดเด่น จุดด้อย และส่งมอบแนวทางปฏิบัติ 3 ข้อที่ชัดเจน',
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      res.status(500).json({
        error: error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับ Gemini AI',
      });
    }
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Vite Dev Server Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });

    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  }

  const port = 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`[Trading Journal Server] Running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('[Trading Journal Server] Startup error:', err);
});
