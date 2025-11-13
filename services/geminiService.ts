import { GoogleGenAI, GenerateContentResponse, Type, Content } from "@google/genai";
import { PPMFormInputs, ModelType, ChatMessage } from '../types';

interface GeminiStructuredOutput {
  text: string;
}

interface GraduateProfileDimensionsOutput {
  dimensions: string[];
}

interface CrossDisciplinaryOutput {
  subjects: string[];
}

interface PedagogicalPracticeOutput {
  model: string;
  strategy: string;
  method: string;
}

interface LearningPartnershipsOutput {
  partnerships: Array<{ partner: string; explanation: string }>;
}

// FIX: Add function overloads for generateContent to correctly infer return types
// Overload 1: No schema provided, returns a string.
export async function generateContent(
  prompt: string,
  modelName?: ModelType,
): Promise<string>;

// Overload 2: Schema provided, returns a parsed object of type T.
export async function generateContent<T>(
  prompt: string,
  modelName: ModelType,
  responseSchema: object,
): Promise<T>;

// Implementation of generateContent with generic type T for structured output
export async function generateContent<T = string>(
  prompt: string,
  modelName: ModelType = ModelType.FLASH,
  responseSchema?: object,
): Promise<string | T> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config: { responseMimeType?: string; responseSchema?: object; thinkingConfig?: { thinkingBudget: number }; maxOutputTokens?: number } = {};

  if (responseSchema) {
    config.responseMimeType = "application/json";
    config.responseSchema = responseSchema;
  }

  // Use thinkingBudget for Flash models if maxOutputTokens is set and it's a longer task
  if (modelName === ModelType.FLASH) {
      config.maxOutputTokens = 2048; // A reasonable default for flash if not explicitly set
      config.thinkingConfig = { thinkingBudget: 512 }; // Reserve some tokens for thinking
  } else if (modelName === ModelType.PRO) {
      config.maxOutputTokens = 4096; // A reasonable default for pro
      config.thinkingConfig = { thinkingBudget: 1024 };
  }


  const response: GenerateContentResponse = await ai.models.generateContent({
    model: modelName,
    contents: [{ parts: [{ text: prompt }] }],
    config,
  });

  const text = response.text.trim();
  if (responseSchema) {
    try {
      // Clean up potential markdown code block for JSON
      const jsonString = text.startsWith('```json') && text.endsWith('```')
        ? text.substring(7, text.length - 3).trim()
        : text;
      // FIX: Cast to T as the schema implies a structured output
      return JSON.parse(jsonString) as T;
    } catch (e) {
      console.error("Failed to parse JSON response:", e, "Raw text:", text);
      throw new Error(`Failed to parse JSON response from Gemini: ${text}`);
    }
  }
  // FIX: If no schema, always return a string
  return text;
};


export const generateIntegratedMaterial = async (
  material: string
): Promise<string> => {
  const prompt = `Integrasikan materi pembelajaran "${material}" dengan nilai-nilai cinta berikut: Cinta Allah dan Rasulnya; cinta ilmu; cinta diri dan sesama; cinta lingkungan; cinta bangsa dan negara. Sajikan dalam satu paragraf yang padu.`;
  return generateContent(prompt, ModelType.FLASH);
};

export const generateGraduateProfileDimensions = async (
  objectives: string
): Promise<string[]> => {
  const prompt = `Berdasarkan tujuan pembelajaran berikut: "${objectives}", pilih dimensi profil lulusan yang paling sesuai dari daftar ini: Keimanan dan Ketakwaan terhadap Tuhan YME; Kewargaan; Penalaran Kritis; Kreativitas; Kolaborasi; Kemandirian; Kesehatan; Komunikasi. Berikan dalam format JSON array of strings. Contoh: {"dimensions": ["Dimensi 1", "Dimensi 2"]}`;
  const schema = {
    type: Type.OBJECT,
    properties: {
      dimensions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Selected graduate profile dimensions.',
      },
    },
    required: ['dimensions'],
  };
  // FIX: The return type is now correctly inferred from the generateContent overload
  const result = await generateContent<GraduateProfileDimensionsOutput>(prompt, ModelType.FLASH, schema);
  return result.dimensions;
};

export const generateIntegratedLearningOutcomes = async (
  outcomes: string
): Promise<string> => {
  const prompt = `Integrasikan capaian pembelajaran berikut: "${outcomes}" dengan nilai-nilai cinta atau KBC (Karakter, Budaya, Cerdas). Sajikan dalam satu paragraf.`;
  return generateContent(prompt, ModelType.FLASH);
};

export const generateCrossDisciplinarySubjects = async (
  objectives: string
): Promise<string[]> => {
  const prompt = `Berdasarkan tujuan pembelajaran berikut: "${objectives}", identifikasi mata pelajaran lintas disiplin ilmu yang relevan. Berikan dalam format JSON array of strings. Contoh: {"subjects": ["Matematika", "Seni Budaya"]}`;
  const schema = {
    type: Type.OBJECT,
    properties: {
      subjects: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'Relevant cross-disciplinary subjects.',
      },
    },
    required: ['subjects'],
  };
  // FIX: The return type is now correctly inferred from the generateContent overload
  const result = await generateContent<CrossDisciplinaryOutput>(prompt, ModelType.FLASH, schema);
  return result.subjects;
};

export const generateIntegratedLearningObjectives = async (
  objectives: string
): Promise<string> => {
  const prompt = `Integrasikan tujuan pembelajaran berikut: "${objectives}" dengan nilai-nilai cinta atau KBC (Karakter, Budaya, Cerdas). Sajikan dalam satu paragraf.`;
  return generateContent(prompt, ModelType.FLASH);
};

export const generatePedagogicalPractices = async (
  objectives: string
): Promise<{ model: string; strategy: string; method: string }> => {
  const prompt = `Berdasarkan tujuan pembelajaran berikut: "${objectives}" dan prinsip pembelajaran mendalam (deep learning), sarankan model, strategi, dan metode pembelajaran yang sesuai. Berikan dalam format JSON. Contoh: {"model": "Project-Based Learning", "strategy": "Discovery Learning", "method": "Diskusi Kelompok"}`;
  const schema = {
    type: Type.OBJECT,
    properties: {
      model: { type: Type.STRING, description: 'Recommended learning model.' },
      strategy: { type: Type.STRING, description: 'Recommended learning strategy.' },
      method: { type: Type.STRING, description: 'Recommended learning method.' },
    },
    required: ['model', 'strategy', 'method'],
  };
  // FIX: The return type is now correctly inferred from the generateContent overload
  const result = await generateContent<PedagogicalPracticeOutput>(prompt, ModelType.FLASH, schema);
  return result;
};

export const generateLearningPartnerships = async (
  objectives: string,
  material: string
): Promise<Array<{ partner: string; explanation: string }>> => {
  const prompt = `Berdasarkan tujuan pembelajaran: "${objectives}" dan materi "${material}", sarankan kemitraan pembelajaran yang relevan (misalnya Laboran sekolah, Guru lain, Pihak dari luar Sekolah seperti komunitas atau ahli). Jelaskan peran masing-masing kemitraan. Berikan dalam format JSON array of objects. Contoh: {"partnerships": [{"partner": "Laboran sekolah", "explanation": "Membantu menyiapkan alat praktikum."}, {"partner": "Komunitas Lingkungan", "explanation": "Mengundang narasumber untuk berbagi pengalaman."}]}`;
  const schema = {
    type: Type.OBJECT,
    properties: {
      partnerships: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            partner: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ['partner', 'explanation'],
        },
      },
    },
    required: ['partnerships'],
  };
  // FIX: The return type is now correctly inferred from the generateContent overload
  const result = await generateContent<LearningPartnershipsOutput>(prompt, ModelType.FLASH, schema);
  return result.partnerships;
};

export const generateLearningEnvironment = async (
  objectives: string,
  material: string
): Promise<{ physical: string; virtual: string; learningCulture: string }> => {
  const prompt = `Berdasarkan tujuan pembelajaran: "${objectives}" dan materi "${material}", jelaskan lingkungan pembelajaran yang ideal. Fokus pada:
a. Fisik: jelaskan lingkungan fisik yang mendukung.
b. Virtual: apa saja media virtual yang mendukung pembelajaran.
c. Budaya Belajar: jelaskan budaya belajar yang ingin dibangun.
Sajikan dalam format JSON. Contoh: {"physical": "Kelas yang fleksibel dengan area diskusi", "virtual": "Platform e-learning, simulasi interaktif", "learningCulture": "Kolaboratif dan saling menghargai"}`;
  const schema = {
    type: Type.OBJECT,
    properties: {
      physical: { type: Type.STRING },
      virtual: { type: Type.STRING },
      learningCulture: { type: Type.STRING },
    },
    required: ['physical', 'virtual', 'learningCulture'],
  };
  // FIX: The return type is now correctly inferred from the generateContent overload
  const result = await generateContent<{ physical: string; virtual: string; learningCulture: string }>(prompt, ModelType.FLASH, schema);
  return result;
};

export const generateDigitalUtilization = async (
  material: string
): Promise<string> => {
  const prompt = `Sebutkan dan jelaskan pemanfaatan media digital yang relevan dengan materi pembelajaran "${material}". Sajikan dalam satu paragraf atau daftar.`;
  return generateContent(prompt, ModelType.FLASH);
};

export const generateLearningExperience = async (
  timeAllocation: string,
  material: string,
  objectives: string
): Promise<{ mindful: string; meaningful: string; joyful: string; initialActivity: string; coreActivity: string; closingActivity: string }> => {
  const prompt = `Buatkan deskripsi pengalaman belajar yang mengintegrasikan pembelajaran mendalam (deep learning), yaitu Berkesadaran (mindful), Bermakna (meaningful), dan Menggembirakan (joyful), untuk materi "${material}" dengan tujuan pembelajaran "${objectives}". Kemudian, jelaskan langkah-langkah pembelajaran dengan alokasi waktu total ${timeAllocation} (contoh: 120 menit). Bagi alokasi waktu tersebut secara proporsional untuk:
1. Kegiatan Awal (sesuaikan alokasi waktu Menit)
2. Kegiatan Inti (sesuaikan alokasi waktu Menit)
3. Kegiatan Penutup (sesuaikan alokasi waktu Menit)

Sajikan output dalam format JSON dengan kunci "mindful", "meaningful", "joyful", "initialActivity", "coreActivity", "closingActivity". Setiap aktivitas harus merupakan deskripsi langkah-langkah dalam format markdown.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      mindful: { type: Type.STRING },
      meaningful: { type: Type.STRING },
      joyful: { type: Type.STRING },
      initialActivity: { type: Type.STRING },
      coreActivity: { type: Type.STRING },
      closingActivity: { type: Type.STRING },
    },
    required: ['mindful', 'meaningful', 'joyful', 'initialActivity', 'coreActivity', 'closingActivity'],
  };
  // FIX: The return type is now correctly inferred from the generateContent overload
  const result = await generateContent<{ mindful: string; meaningful: string; joyful: string; initialActivity: string; coreActivity: string; closingActivity: string }>(prompt, ModelType.PRO, schema);
  return result;
};

export const generateAssessments = async (
  material: string,
  objectives: string
): Promise<{ initialAssessment: string; processAssessment: string; finalAssessment: string }> => {
  const prompt = `Berdasarkan materi pembelajaran: "${material}" dan tujuan pembelajaran: "${objectives}", jelaskan bentuk asesmen pembelajaran yang paling sesuai untuk:
1. Asesmen Awal Pembelajaran
2. Asesmen Proses Pembelajaran (Formatif dan Sikap)
3. Asesmen Akhir Pembelajaran (Sumatif)
Sajikan dalam format JSON. Contoh: {"initialAssessment": "Pre-test tertulis", "processAssessment": "Observasi, Jurnal Belajar", "finalAssessment": "Proyek akhir"}`;
  const schema = {
    type: Type.OBJECT,
    properties: {
      initialAssessment: { type: Type.STRING },
      processAssessment: { type: Type.STRING },
      finalAssessment: { type: Type.STRING },
    },
    required: ['initialAssessment', 'processAssessment', 'finalAssessment'],
  };
  // FIX: The return type is now correctly inferred from the generateContent overload
  const result = await generateContent<{ initialAssessment: string; processAssessment: string; finalAssessment: string }>(prompt, ModelType.FLASH, schema);
  return result;
};

export const generateLKPD = async (
  material: string,
  objectives: string
): Promise<{ title: string; content: string }> => {
  const prompt = `Buatkan konten Lembar Kerja Peserta Didik (LKPD) yang menarik dan relevan dengan materi pembelajaran "${material}" dan tujuan pembelajaran "${objectives}". Sertakan judul LKPD dan buatkan tabel LKPD yang mencakup petunjuk, tugas/aktivitas, dan ruang untuk jawaban/observasi. Sajikan sebagai markdown, dengan judul pada baris pertama dan konten LKPD (termasuk tabel) setelahnya.`;
  const response = await generateContent(prompt, ModelType.PRO);
  const lines = response.split('\n');
  const title = lines[0].replace('Judul: ', '').trim();
  const content = lines.slice(1).join('\n').trim();
  return { title, content };
};

export const generateRubrics = async (
  objectives: string,
  material: string
): Promise<{ cognitive: string; attitude: string; presentation: string }> => {
  const prompt = `Berdasarkan tujuan pembelajaran: "${objectives}" dan materi pembelajaran: "${material}", buatkan rubrik penilaian dalam format markdown untuk:
A. Rubrik Penilaian Kognitif
B. Rubrik Penilaian Sikap
C. Rubrik Penilaian Presentasi
Pastikan setiap rubrik memiliki kriteria dan skor/deskriptor yang jelas.`;
  const response = await generateContent(prompt, ModelType.PRO);
  
  const sections = response.split(/A\. Rubrik Penilaian Kognitif\n|B\. Rubrik Penilaian Sikap\n|C\. Rubrik Penilaian Presentasi\n/).filter(s => s.trim() !== '');

  let cognitive = '';
  let attitude = '';
  let presentation = '';

  // Simple parsing assumes the order matches
  if (sections.length >= 1) {
    cognitive = `A. Rubrik Penilaian Kognitif\n${sections[0].trim()}`;
  }
  if (sections.length >= 2) {
    attitude = `B. Rubrik Penilaian Sikap\n${sections[1].trim()}`;
  }
  if (sections.length >= 3) {
    presentation = `C. Rubrik Penilaian Presentasi\n${sections[2].trim()}`;
  }

  return { cognitive, attitude, presentation };
};

export const sendChatMessage = async (
  message: string,
  history: ChatMessage[],
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // FIX: Convert the internal ChatMessage[] to the GoogleGenAI Content[] format
  const genaiHistory: Content[] = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.content }]
  }));

  // FIX: Pass the history to ai.chats.create
  const chat = ai.chats.create({
    model: ModelType.FLASH,
    config: {
      // Small thinking budget for chat to keep it responsive
      thinkingConfig: { thinkingBudget: 25 },
      maxOutputTokens: 512,
    },
    history: genaiHistory, // Pass the converted history here
  });

  // FIX: sendMessage only needs the current message as an object with `message` property
  const response = await chat.sendMessage({
    message: message,
  });

  return response.text;
};