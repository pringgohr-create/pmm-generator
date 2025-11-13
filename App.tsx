import React, { useState, useCallback } from 'react';
import { PPMFormInputs, PPMContent } from './types';
import PPMForm from './components/PPMForm';
import PPMDisplay from './components/PPMDisplay';
import ChatBot from './components/ChatBot';
import LoadingSpinner from './components/LoadingSpinner';
import {
  generateIntegratedMaterial,
  generateGraduateProfileDimensions,
  generateIntegratedLearningOutcomes,
  generateCrossDisciplinarySubjects,
  generateIntegratedLearningObjectives,
  generatePedagogicalPractices,
  generateLearningPartnerships,
  generateLearningEnvironment,
  generateDigitalUtilization,
  generateLearningExperience,
  generateAssessments,
  generateLKPD,
  generateRubrics,
} from './services/geminiService';

const initialFormData: PPMFormInputs = {
  madrasahName: '',
  teacherName: '',
  subject: '',
  phase: '',
  grade: '',
  semester: '',
  timeAllocation: '',
  learningOutcomes: '',
  learningObjectives: '',
  learningMaterial: '',
};

const App: React.FC = () => {
  const [formData, setFormData] = useState<PPMFormInputs>(initialFormData);
  const [ppmContent, setPpmContent] = useState<PPMContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const generatePPM = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPpmContent(null);

    try {
      const integratedMaterialPromise = generateIntegratedMaterial(formData.learningMaterial);
      const graduateProfileDimensionsPromise = generateGraduateProfileDimensions(formData.learningObjectives);
      const integratedLearningOutcomesPromise = generateIntegratedLearningOutcomes(formData.learningOutcomes);
      const crossDisciplinarySubjectsPromise = generateCrossDisciplinarySubjects(formData.learningObjectives);
      const integratedLearningObjectivesPromise = generateIntegratedLearningObjectives(formData.learningObjectives);
      const pedagogicalPracticesPromise = generatePedagogicalPractices(formData.learningObjectives);
      const learningPartnershipsPromise = generateLearningPartnerships(formData.learningObjectives, formData.learningMaterial);
      const learningEnvironmentPromise = generateLearningEnvironment(formData.learningObjectives, formData.learningMaterial);
      const digitalUtilizationPromise = generateDigitalUtilization(formData.learningMaterial);
      const learningExperiencePromise = generateLearningExperience(formData.timeAllocation, formData.learningMaterial, formData.learningObjectives);
      const assessmentsPromise = generateAssessments(formData.learningMaterial, formData.learningObjectives);
      const lkpdPromise = generateLKPD(formData.learningMaterial, formData.learningObjectives);
      const rubricsPromise = generateRubrics(formData.learningObjectives, formData.learningMaterial);


      const [
        integratedMaterial,
        graduateProfileDimensions,
        integratedLearningOutcomes,
        crossDisciplinarySubjects,
        integratedLearningObjectives,
        pedagogicalPractices,
        learningPartnerships,
        learningEnvironment,
        digitalUtilization,
        learningExperience,
        assessments,
        lkpd,
        rubrics,
      ] = await Promise.all([
        integratedMaterialPromise,
        graduateProfileDimensionsPromise,
        integratedLearningOutcomesPromise,
        crossDisciplinarySubjectsPromise,
        integratedLearningObjectivesPromise,
        pedagogicalPracticesPromise,
        learningPartnershipsPromise,
        learningEnvironmentPromise,
        digitalUtilizationPromise,
        learningExperiencePromise,
        assessmentsPromise,
        lkpdPromise,
        rubricsPromise,
      ]);

      setPpmContent({
        identity: {
          madrasahName: formData.madrasahName,
          teacherName: formData.teacherName,
          subject: formData.subject,
          phase: formData.phase,
          semester: formData.semester,
          integratedMaterial: integratedMaterial,
          graduateProfileDimensions: graduateProfileDimensions,
          mainMaterial: formData.learningMaterial,
        },
        design: {
          integratedLearningOutcomes: integratedLearningOutcomes,
          crossDisciplinary: crossDisciplinarySubjects,
          integratedLearningObjectives: integratedLearningObjectives,
          pedagogicalPractices: pedagogicalPractices,
          learningPartnerships: learningPartnerships,
          learningEnvironment: learningEnvironment,
          digitalUtilization: digitalUtilization,
        },
        experience: {
          mindful: learningExperience.mindful,
          meaningful: learningExperience.meaningful,
          joyful: learningExperience.joyful,
          initialActivity: learningExperience.initialActivity,
          coreActivity: learningExperience.coreActivity,
          closingActivity: learningExperience.closingActivity,
        },
        assessment: {
          initialAssessment: assessments.initialAssessment,
          processAssessment: assessments.processAssessment,
          finalAssessment: assessments.finalAssessment,
        },
        attachments: {
          lkpdTitle: lkpd.title,
          lkpdContent: lkpd.content,
          cognitiveRubric: rubrics.cognitive,
          attitudeRubric: rubrics.attitude,
          presentationRubric: rubrics.presentation,
        },
      });
    } catch (err) {
      console.error('Error generating PPM:', err);
      setError(`Gagal membuat PPM: ${err instanceof Error ? err.message : String(err)}. Mohon coba lagi atau periksa input Anda.`);
    } finally {
      setIsLoading(false);
    }
  }, [formData]); // Dependencies for useCallback

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-2">PPM Generator with Gemini AI</h1>
        <p className="text-lg text-blue-600">Buat Perencanaan Pembelajaran Mendalam Anda secara otomatis</p>
        <p className="text-sm text-gray-500">Dibuat oleh HARMAJI</p>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-2xl mx-auto" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <PPMForm
            formData={formData}
            onFormChange={handleFormChange}
            onSubmit={generatePPM}
            isLoading={isLoading}
          />
          {isLoading && <LoadingSpinner />}
        </div>
        <div className="relative">
          {ppmContent ? (
            <PPMDisplay ppmData={ppmContent} />
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto my-6 flex flex-col items-center justify-center min-h-[500px] text-gray-500 italic">
              <svg className="w-16 h-16 mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <p>Isi formulir untuk menghasilkan Perencanaan Pembelajaran Mendalam Anda.</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <ChatBot />
      </div>
    </div>
  );
};

export default App;
