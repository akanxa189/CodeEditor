import express from 'express';
import Groq from 'groq-sdk';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const getGroq = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

router.post('/', protect, async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: 'Please provide code and language' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ message: 'GROQ_API_KEY is not configured' });
    }

    const response = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert code reviewer. Review the 
      provided code and respond ONLY with a valid JSON object 
      with no markdown, no backticks, no extra text. 
      Format:
      {
        "score": number (0-100),
        "bugs": [{ "line": number, "issue": string, "fix": string }],
        "performance": [{ "issue": string, "suggestion": string }],
        "security": [{ "issue": string, "suggestion": string }],
        "bestPractices": [{ "issue": string, "suggestion": string }],
        "improvedCode": string
      }`,
        },
        {
          role: 'user',
          content: `Review this ${language} code:\n\n${code}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return res.status(500).json({ message: 'No response from AI' });
    }

    const reviewData = JSON.parse(content);

    const review = await Review.create({
      user: req.user._id,
      code,
      language,
      score: reviewData.score ?? 0,
      bugs: reviewData.bugs ?? [],
      performance: reviewData.performance ?? [],
      security: reviewData.security ?? [],
      bestPractices: reviewData.bestPractices ?? [],
      improvedCode: reviewData.improvedCode ?? '',
    });

    res.json({
      _id: review._id,
      score: review.score,
      bugs: review.bugs,
      performance: review.performance,
      security: review.security,
      bestPractices: review.bestPractices,
      improvedCode: review.improvedCode,
      language: review.language,
      createdAt: review.createdAt,
    });
  } catch (error) {
    console.error('Review error:', error);
    res.status(500).json({ message: error.message || 'Failed to review code' });
  }
});

export default router;
