import { Request, Response } from "express"
import Content from "../Models/Content";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

enum ResponseStatus {
    Success = 200,
    NotFound = 404,
    Error = 500,
    AlreadyExists = 403
}

export const chatController = async (req: Request, res: Response) => {
    try {
        const { query } = req.body;
        //@ts-ignore
        const userId = req.userId;

        // Fetch all user content
        const content = await Content.find({ userId });

        if (!process.env.GEMINI_API_KEY) {
            res.status(ResponseStatus.Error).json({
                message: "Gemini API Key is not configured on the backend."
            })
            return;
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Construct context from user's content
        // Optimizing context window: limiting to reasonable amount of text if needed, 
        // but 1.5 Flash has a huge context window so we can dump a lot.
        let context = "You are an intelligent assistant for a 'Second Brain' application. Your job is to answer the user's question based ONLY on their saved content provided below.\n\n";

        context += "USER'S SAVED CONTENT:\n";
        content.forEach((item, idx) => {
            context += `[${idx + 1}] Title: ${item.title}\n`;
            context += `    Type: ${item.type}\n`;
            if (item.description) context += `    Description: ${item.description}\n`;
            if (item.tags && item.tags.length > 0) context += `    Tags: ${item.tags.join(', ')}\n`;
            if (item.link) context += `    Link: ${item.link}\n`;
            context += "\n";
        });

        context += "\nINSTRUCTIONS:\n";
        context += "1. Answer the user's question using the content above.\n";
        context += "2. If the answer is not in the content, say 'I couldn't find relevant information in your Second Brain.'.\n";
        context += "3. Reference the specific notes/content you used (e.g., 'According to your note about React...').\n";
        context += "4. Keep the answer concise and helpful.\n";
        context += `\nUSER QUESTION: ${query}`;

        const result = await model.generateContent(context);
        const response = await result.response;
        const answer = response.text();

        res.status(ResponseStatus.Success).json({
            answer
        })

    } catch (error) {
        console.error("Chat Error:", error);
        res.status(ResponseStatus.Error).json({
            message: "Error processing your request with AI"
        })
    }
}

export const generateMetadataController = async (req: Request, res: Response) => {
    try {
        const { title, link } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            res.status(ResponseStatus.Error).json({ message: "Gemini API Key missing" });
            return;
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `
        Analyze the following content metadata and generate:
        1. A concise description (max 2 sentences).
        2. A list of 3-5 relevant tags (lowercase, single words).
        3. The most likely content type from this list: ['x', 'youtube', 'document', 'link'].

        Title: ${title}
        Link: ${link}

        Return ONLY a JSON object in this format (no markdown):
        {
            "description": "string",
            "tags": ["string", "string"],
            "type": "string"
        }
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean markdown code blocks if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(text);

        res.status(ResponseStatus.Success).json(data);

    } catch (error) {
        console.error("Metadata Generation Error:", error);
        res.status(ResponseStatus.Error).json({ message: "Failed to generate metadata" });
    }
}
