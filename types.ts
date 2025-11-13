export interface PPMFormInputs {
  madrasahName: string;
  teacherName: string;
  subject: string;
  phase: string;
  grade: string;
  semester: string;
  timeAllocation: string; // e.g., "120 menit"
  learningOutcomes: string;
  learningObjectives: string;
  learningMaterial: string;
}

export interface PPMContent {
  // I. IDENTITAS
  identity: {
    madrasahName: string;
    teacherName: string;
    subject: string;
    phase: string;
    semester: string;
    integratedMaterial: string;
    graduateProfileDimensions: string[];
    mainMaterial: string;
  };
  // II. DESAIN PEMBELAJARAN
  design: {
    integratedLearningOutcomes: string;
    crossDisciplinary: string[];
    integratedLearningObjectives: string;
    pedagogicalPractices: {
      model: string;
      strategy: string;
      method: string;
    };
    learningPartnerships: Array<{ partner: string; explanation: string }>;
    learningEnvironment: {
      physical: string;
      virtual: string;
      learningCulture: string;
    };
    digitalUtilization: string;
  };
  // III. PENGALAMAN BELAJAR
  experience: {
    mindful: string;
    meaningful: string;
    joyful: string;
    initialActivity: string;
    coreActivity: string;
    closingActivity: string;
  };
  // IV. ASESMEN PEMBELAJARAN
  assessment: {
    initialAssessment: string;
    processAssessment: string;
    finalAssessment: string;
  };
  // Lampiran
  attachments: {
    lkpdTitle: string;
    lkpdContent: string;
    cognitiveRubric: string;
    attitudeRubric: string;
    presentationRubric: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export enum ModelType {
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-2.5-pro'
}
