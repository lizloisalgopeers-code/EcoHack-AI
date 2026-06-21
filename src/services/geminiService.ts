import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface QuizData {
  fact: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const FALLBACK_QUIZZES: QuizData[] = [
  {
    fact: "Humans use about 127 gallons (480 liters) of water daily. Recycling paper saves thousands of gallons per ton!",
    question: "How many gallons of water can recycling one ton of paper save?",
    options: ["About 7,000 gallons", "About 50 gallons", "Only 100 gallons", "Over 20,000 gallons"],
    correctAnswer: "About 7,000 gallons",
    explanation: "Correct! Recycling one ton of paper saves an incredible 7,000 gallons of clean water, reducing human industrial footprint!"
  },
  {
    fact: "An average human discards around 4.5 pounds of trash daily. Together, humans produce over 2 billion tons of waste annually!",
    question: "Roughly how much garbage does an average person discard every single day?",
    options: ["0.5 pounds", "4.5 pounds", "12 pounds", "25 pounds"],
    correctAnswer: "4.5 pounds",
    explanation: "Spot-on! Each human averages 4.5 pounds of trash daily. That's why smart upcycling and crafting are huge vibe-savers!"
  },
  {
    fact: "Aluminum cans can be recycled infinitely without losing any quality. A recycled can can be back on the shelf in just 60 days!",
    question: "How long does it take for a recycled aluminum can to return to a store shelf?",
    options: ["60 days", "1 year", "10 days", "6 months"],
    correctAnswer: "60 days",
    explanation: "Fast craft! In just 60 days, that exact same can can be processed and put back on the shelves, saving 95% of the energy compared to raw metal!"
  }
];

export async function getDailyFact(): Promise<QuizData> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a surprising, mind-blowing daily fact about the human world, history, culture, or our environmental/recycling impact. 
      Follow it with a multiple-choice quiz question directly testing the reader on that fact or immediately derived knowledge.
      Ensure there are exactly 4 distinct and highly entertaining multiple-choice options, a single correct answer (which must match one of the options exactly), and a short positive explanation.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fact: { type: Type.STRING, description: "A mind-blowing fact about the human world or earth conservation. Keep under 25 words." },
            question: { type: Type.STRING, description: "A multiple-choice question directly based on or closely related to the facts mentioned." },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "Exactly 4 options. Make them clear and distinct." 
            },
            correctAnswer: { type: Type.STRING, description: "The exact correct option string representing the right answer." },
            explanation: { type: Type.STRING, description: "A high-energy, positive explanation justifying why this is the correct answer." }
          },
          required: ["fact", "question", "options", "correctAnswer", "explanation"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as QuizData;
      // Safeguard: Ensure options includes correct answer
      if (Array.isArray(data.options) && data.options.length === 4 && data.correctAnswer) {
        if (!data.options.includes(data.correctAnswer)) {
          data.options[0] = data.correctAnswer;
        }
        return data;
      }
    }
  } catch (error) {
    console.error("Failed to generate dynamic quiz via Gemini. Using fallback.", error);
  }

  // Pick random fallback
  const randomIndex = Math.floor(Math.random() * FALLBACK_QUIZZES.length);
  return FALLBACK_QUIZZES[randomIndex];
}

export async function generateHack(item: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide 3 distinct "5-minute craft" style ways to recycle or upcycle: ${item}. 
    
    Option 1: THE 5-MINUTE QUICK HACK (Fastest & Easiest)
    Option 2: THE PRACTICAL REUSE (Most useful for the home)
    Option 3: THE ARTISTIC UPCYCLE (Most creative/decorative)
    
    Return the response as a JSON array of 3 objects.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "Quick Hack, Practical Reuse, or Artistic Upcycle" },
            title: { type: Type.STRING },
            why: { type: Type.STRING, description: "Why it's cool" },
            time: { type: Type.STRING, description: "Time required, e.g., '2 mins'" },
            materials: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of materials/ingredients" },
            steps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 punchy steps" }
          },
          required: ["type", "title", "why", "time", "materials", "steps"]
        }
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    return [];
  }
}

export async function checkRecyclability(item: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tell me if the following item is recyclable and how to dispose of it correctly: ${item}. 
    Keep the tone high-energy and "5-minute craft" style.
    Format as:
    # [Item Name]
    **Recyclable:** Yes/No/Maybe
    
    ## How to Dispose
    - Bullet points for disposal
    
    ## Pro Tip
    - One quick tip.`,
  });
  return response.text || "Could not check recyclability right now.";
}
