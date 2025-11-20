
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ResumeData } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

const cleanJson = (text: string): string => {
  // Remove markdown code blocks if present
  return text.replace(/^```json\s*/, '').replace(/\s*```$/, '');
};

export const optimizeDescription = async (description: string, role: string): Promise<string> => {
  const ai = getAiClient();

  const prompt = `
    You are an expert ATS Resume Optimizer. 
    Rewrite the following job description for a "${role}" role to be more ATS-friendly.
    Use strong action verbs, quantify achievements where possible, and improve clarity.
    Keep it concise but impactful. Do not add markdown formatting like bolding.
    
    Original Description:
    "${description}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || description;
  } catch (error) {
    console.error("Optimization failed", error);
    throw error;
  }
};

export const analyzeATS = async (resume: ResumeData): Promise<{ score: number; breakdown: { keywords: number; impact: number; formatting: number }; suggestions: string[]; missingKeywords: string[]; rewrittenSummary: string }> => {
  const ai = getAiClient();

  // Create a simplified version of resume data to save tokens and focus analysis
  const simplifiedData = {
    role: resume.experience[0]?.role || 'Professional',
    summary: resume.personal.summary,
    skills: resume.skills,
    experience: resume.experience.map(e => ({
      role: e.role,
      company: e.company,
      description: e.description
    })),
    projects: resume.projects.map(p => ({
      name: p.name,
      description: p.description
    }))
  };

  const resumeText = JSON.stringify(simplifiedData);

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.INTEGER, description: "Overall score from 0 to 100 based on ATS friendliness." },
      breakdown: {
        type: Type.OBJECT,
        description: "Breakdown of the score into key categories.",
        properties: {
          keywords: { type: Type.INTEGER, description: "Score (0-100) for relevance and usage of industry keywords." },
          impact: { type: Type.INTEGER, description: "Score (0-100) for use of action verbs and quantified achievements." },
          formatting: { type: Type.INTEGER, description: "Score (0-100) for clarity, structure, and brevity." }
        },
        required: ["keywords", "impact", "formatting"]
      },
      suggestions: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING }, 
        description: "3-5 specific actionable improvements." 
      },
      missingKeywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "List of important industry keywords that seem missing based on the content."
      },
      rewrittenSummary: {
        type: Type.STRING,
        description: "A rewritten, optimized version of the candidate's professional summary that incorporates missing keywords and best practices."
      }
    },
    required: ["score", "breakdown", "suggestions", "missingKeywords", "rewrittenSummary"]
  };

  const prompt = `
    Analyze the following resume data for ATS (Applicant Tracking System) compatibility.
    Critique the content, keyword usage, and overall impact.
    Provide a detailed score breakdown and a rewritten summary.
    
    Resume Data:
    ${resumeText}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Ensure we have valid JSON
    const cleanedText = cleanJson(text);
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Analysis failed", error);
    throw error;
  }
};
