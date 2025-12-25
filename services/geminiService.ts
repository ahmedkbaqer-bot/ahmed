
import { GoogleGenAI, Type } from "@google/genai";

// Always initialize with process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJobDescription = async (
  title: string,
  sector: string,
  location: string,
  keywords: string
): Promise<string> => {
  // We assume process.env.API_KEY is pre-configured and valid.
  try {
    const prompt = `
      أنت خبير موارد بشرية متخصص في السوق العراقي.
      اكتب وصف وظيفي احترافي وجذاب باللغة العربية للوظيفة التالية:
      - المسمى الوظيفي: ${title}
      - القطاع: ${sector}
      - المحافظة: ${location}
      - كلمات مفتاحية/مهارات مطلوبة: ${keywords}

      يجب أن يتضمن الوصف:
      1. نبذة مختصرة وجذابة عن الدور.
      2. المسؤوليات الرئيسية (على شكل نقاط).
      3. المؤهلات المطلوبة (على شكل نقاط).
      
      اجعل اللهجة مهنية ولكن مشجعة، واستخدم مصطلحات مفهومة في سوق العمل العراقي.
      لا تضع مقدمات، ابدأ بالوصف مباشرة.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Directly access the text property as per the SDK guidelines.
    return response.text || "لم يتم إنشاء وصف وظيفي.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "حدث خطأ أثناء إنشاء الوصف الوظيفي. يرجى المحاولة مرة أخرى.";
  }
};

export interface AiSearchResult {
  text: string;
  sources: { title: string; uri: string }[];
}

export const searchRealTimeJobs = async (query: string, location: string): Promise<AiSearchResult> => {
  try {
    const prompt = `ابحث عن أحدث وظائف ${query} في ${location || 'العراق'} المنشورة اليوم أو هذا الأسبوع. 
    اذكر اسم الشركة، المسمى الوظيفي، وملخص سريع للمتطلبات. 
    ركز على الوظائف الحقيقية المتاحة الآن للتقديم.
    اجب باللغة العربية بشكل منسق.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "لم أجد نتائج محددة حالياً.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Extract grounding URLs and display them in the app.
    const sources = chunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web?.title || 'مصدر خارجي',
        uri: chunk.web?.uri || ''
      }))
      .filter(s => s.uri !== '');

    return { text, sources };
  } catch (error) {
    console.error("AI Search Error:", error);
    throw error;
  }
};

export interface AdminAiTaskResult {
  actionType: 'announcement' | 'article' | 'analysis';
  content: any;
  explanation: string;
}

export const adminAiTask = async (adminPrompt: string): Promise<AdminAiTaskResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `بصفتك مساعد إدارة ذكي لمنصة توظيف في العراق، قم بتنفيذ المهمة التالية: ${adminPrompt}.
      
      يجب أن تكون المخرجات بتنسيق JSON حصراً ويحتوي على:
      1. actionType: نوع الإجراء المقترح (announcement, article, analysis).
      2. content: البيانات الفعلية المقترحة (مثلاً كائن يحتوي على title و content للمقال، أو نص للإعلان).
      3. explanation: سبب هذا الاقتراح.
      
      إذا كانت المهمة تتطلب أخباراً حديثة، استخدم أداة البحث.`,
      config: {
        responseMimeType: "application/json",
        tools: [{ googleSearch: {} }],
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            actionType: { type: Type.STRING },
            content: { type: Type.OBJECT, properties: { 
              title: { type: Type.STRING },
              text: { type: Type.STRING },
              category: { type: Type.STRING },
              isImportant: { type: Type.BOOLEAN }
            }},
            explanation: { type: Type.STRING }
          },
          required: ["actionType", "content", "explanation"]
        }
      }
    });

    // response.text property access directly. Note: citations from search are handled by the model within JSON fields.
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Admin AI Task Error:", error);
    throw error;
  }
};