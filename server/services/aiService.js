// server/services/aiService.js
const { pipeline } = require("@huggingface/transformers");
const logger = require("../utils/logger");

class AIService {
  constructor() {
    this.generator = null;
  }

  async initialize() {
    try {
      this.generator = await pipeline(
        "text-generation",
        "deepseek-ai/deepseek-llm",
        {
          quantized: true, // For faster inference
        }
      );
      logger.info("AI Model loaded successfully");
    } catch (error) {
      logger.error("AI Model initialization failed:", error);
      throw new Error("AI service unavailable");
    }
  }

  async generateAdContent(context) {
    const prompt = `
      Generate Google Ads campaign content for:
      - Business: ${context.business}
      - Audience: ${context.audience}
      - Budget: $${context.budget}

      Output JSON format:
      {
        "headlines": [5 creative headlines under 30 chars],
        "descriptions": [3 descriptions under 90 chars],
        "keywords": [10 relevant keywords]
      }
    `;

    try {
      const output = await this.generator(prompt, {
        max_length: 500,
        temperature: 0.7,
        top_p: 0.9,
      });

      return this.sanitizeOutput(output[0].generated_text);
    } catch (error) {
      logger.error("AI Generation failed:", error);
      throw new Error("Content generation failed");
    }
  }

  sanitizeOutput(rawText) {
    // Advanced parsing with validation
    const jsonString = rawText.match(/\{[\s\S]*\}/)?.[0] || "{}";

    try {
      const data = JSON.parse(jsonString);

      // Validation
      if (!data.headlines || !data.descriptions || !data.keywords) {
        throw new Error("Invalid AI output structure");
      }

      return {
        headlines: data.headlines.slice(0, 5),
        descriptions: data.descriptions.slice(0, 3),
        keywords: data.keywords.slice(0, 10),
      };
    } catch (error) {
      logger.error("AI Output parsing failed:", error);
      throw new Error("Failed to parse AI response");
    }
  }
}

module.exports = new AIService();
