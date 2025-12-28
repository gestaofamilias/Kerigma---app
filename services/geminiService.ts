
import { GoogleGenAI } from "@google/genai";
import { Family } from "../types";

export const getFamilyInsights = async (family: Family): Promise<string> => {
  try {
    // Correct initialization as per instructions
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analise os dados desta família e forneça sugestões breves de acompanhamento espiritual ou social (máximo 100 palavras):
      Nome: ${family.name}
      Líder: ${family.leader}
      Departamento: ${family.department}
      Status: ${family.status}
      Membros: ${family.membersCount}`,
      config: {
        systemInstruction: "Você é um assistente pastoral sábio e empático que ajuda na gestão de comunidades religiosas.",
        temperature: 0.7,
      }
    });
    return response.text || "Sem insights disponíveis no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível gerar insights agora. Verifique a chave de API.";
  }
};
