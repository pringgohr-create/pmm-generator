import React, { useRef, useCallback } from 'react';
import { PPMContent } from '../types';
import ReactMarkdown from 'react-markdown';

interface PPMDisplayProps {
  ppmData: PPMContent;
}

const renderMarkdown = (text: string) => {
  if (!text) return null;
  return <ReactMarkdown className="markdown-content space-y-2">{text}</ReactMarkdown>;
};

const PPMDisplay: React.FC<PPMDisplayProps> = ({ ppmData }) => {
  const ppmContentRef = useRef<HTMLDivElement>(null);

  if (!ppmData || !ppmData.identity) {
    return null;
  }

  const handleExportToWord = useCallback(() => {
    if (ppmContentRef.current) {
      const filename = `PPM_Generated_${ppmData.identity.madrasahName.replace(/\s/g, '_')}_${ppmData.identity.subject.replace(/\s/g, '_')}.doc`;
      
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Perencanaan Pembelajaran Mendalam (PPM)</title>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
            <style>
                body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 20px; }
                h1, h2, h3, h4, h5, h6 { color: #1a202c; margin-bottom: 10px; }
                h1 { font-size: 2.25em; text-align: center; }
                h2 { font-size: 1.75em; text-align: center; }
                h3 { font-size: 1.5em; color: #1e40af; margin-bottom: 0.75em; } /* blue-700 */
                p, ul, ol, div { margin-bottom: 0.75em; }
                ul, ol { padding-left: 20px; }
                strong { font-weight: bold; }
                .text-center { text-align: center; }
                .text-sm { font-size: 0.875em; }
                .text-gray-600 { color: #4a5568; }
                .italic { font-style: italic; }
                .mb-4 { margin-bottom: 1rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mt-4 { margin-top: 1rem; }
                .space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.25rem; }
                .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; }
                .markdown-content > *:not([hidden]) ~ *:not([hidden]) { margin-top: 0.5rem; } /* Adjusted for markdown */
                .list-disc { list-style-type: disc; }
                .list-decimal { list-style-type: decimal; }
                .ml-4 { margin-left: 1rem; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
                th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; } /* Changed border to black */
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            ${ppmContentRef.current.innerHTML}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], {
        type: 'application/msword;charset=utf-8',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [ppmData]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto my-6 markdown-container">
      <div className="text-center mb-6">
        <button
          onClick={handleExportToWord}
          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out mb-4"
        >
          Ekspor ke Word
        </button>
      </div>

      <div ref={ppmContentRef}>
        <h2 className="text-3xl font-bold mb-4 text-center">Perencanaan Pembelajaran Mendalam (PPM)</h2>
        <p className="text-center text-sm text-gray-600 mb-6">HARMAJI</p>

        {/* I. IDENTITAS */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-3 text-blue-700">I. IDENTITAS</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Nama Madrasah:</strong> {ppmData.identity.madrasahName}</li>
            <li><strong>Nama Guru:</strong> {ppmData.identity.teacherName}</li>
            <li><strong>Mata Pelajaran:</strong> {ppmData.identity.subject}</li>
            <li><strong>Fase:</strong> {ppmData.identity.phase}</li>
            <li><strong>Semester:</strong> {ppmData.identity.semester}</li>
          </ul>
          <div className="mt-4 space-y-3">
            <p><strong>1. Materi Pelajaran:</strong> {renderMarkdown(ppmData.identity.integratedMaterial)}</p>
            <p><strong>2. Dimensi Profil Lulusan:</strong> {ppmData.identity.graduateProfileDimensions.join(', ')}</p>
            <p><strong>3. Pokok Materi:</strong> {ppmData.identity.mainMaterial}</p>
          </div>
        </section>

        {/* II. DESAIN PEMBELAJARAN */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-3 text-blue-700">II. DESAIN PEMBELAJARAN</h3>
          <p className="italic text-gray-700 text-sm mb-4">
            Pembelajaran mendalam (deep learning) adalah pendekatan holistik yang mengintegrasikan pembelajaran penuh kesadaran (mindful),
            pembelajaran bermakna (meaningful), dan pembelajaran menyenangkan (joyful). Ketiga komponen ini saling berkaitan
            dan memperkuat satu sama lain untuk menciptakan lingkungan belajar yang efektif dan menyenangkan.
            Pendekatan ini mengintegrasikan olah pikir, olah hati, olah rasa, dan olah raga secara terpadu untuk pembelajaran yang lebih holistik.
          </p>
          <div className="space-y-3">
            <p><strong>1. Capaian Pembelajaran:</strong> {renderMarkdown(ppmData.design.integratedLearningOutcomes)}</p>
            <p><strong>2. Lintas Disiplin Ilmu:</strong> {ppmData.design.crossDisciplinary.join(', ')}</p>
            <p><strong>3. Tujuan Pembelajaran:</strong> {renderMarkdown(ppmData.design.integratedLearningObjectives)}</p>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-gray-800">4. Praktik Pedagogis:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Model:</strong> {ppmData.design.pedagogicalPractices.model}</li>
              <li><strong>Strategi:</strong> {ppmData.design.pedagogicalPractices.strategy}</li>
              <li><strong>Metode:</strong> {ppmData.design.pedagogicalPractices.method}</li>
            </ul>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-gray-800">5. Kemitraan Pembelajaran:</p>
            <ul className="list-decimal list-inside ml-4 space-y-1">
              {ppmData.design.learningPartnerships.map((p, index) => (
                <li key={index}>
                  <strong>{p.partner}:</strong> {p.explanation}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <p className="font-semibold text-gray-800">6. Lingkungan Pembelajaran:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li><strong>Fisik:</strong> {ppmData.design.learningEnvironment.physical}</li>
              <li><strong>Virtual:</strong> {ppmData.design.learningEnvironment.virtual}</li>
              <li><strong>Budaya Belajar:</strong> {ppmData.design.learningEnvironment.learningCulture}</li>
            </ul>
          </div>

          <div className="mt-4">
            <p><strong>7. Pemanfaatan Digital:</strong> {ppmData.design.digitalUtilization}</p>
          </div>
        </section>

        {/* III. PENGALAMAN BELAJAR */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-3 text-blue-700">III. PENGALAMAN BELAJAR</h3>
          <p>Kaitkan ketiga hal ini dengan kegiatan pembelajaran:</p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li><strong>Berkesadaran (mindful):</strong> {ppmData.experience.mindful}</li>
            <li><strong>Bermakna (meaningful):</strong> {ppmData.experience.meaningful}</li>
            <li><strong>Menggembirakan (joyful):</strong> {ppmData.experience.joyful}</li>
          </ul>

          <div className="mt-4">
            <p className="font-semibold text-gray-800">Langkah pembelajaran mendalam:</p>
            <div className="ml-4 space-y-3">
              <p><strong>1. Kegiatan Awal:</strong> {renderMarkdown(ppmData.experience.initialActivity)}</p>
              <p><strong>2. Kegiatan Inti:</strong> {renderMarkdown(ppmData.experience.coreActivity)}</p>
              <p><strong>3. Kegiatan Penutup:</strong> {renderMarkdown(ppmData.experience.closingActivity)}</p>
            </div>
          </div>
        </section>

        {/* IV. ASESMEN PEMBELAJARAN */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-3 text-blue-700">IV. ASESMEN PEMBELAJARAN</h3>
          <div className="space-y-3">
            <p><strong>1. Asesmen Awal Pembelajaran:</strong> {ppmData.assessment.initialAssessment}</p>
            <p><strong>2. Asesmen Proses Pembelajaran (Formatif dan Sikap):</strong> {ppmData.assessment.processAssessment}</p>
            <p><strong>3. Asesmen Akhir Pembelajaran (Sumatif):</strong> {ppmData.assessment.finalAssessment}</p>
          </div>
        </section>

        {/* Lampiran */}
        <section>
          <h3 className="text-xl font-bold mb-3 text-blue-700">Lampiran</h3>

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-2">1. Lembar Kerja Peserta Didik (LKPD)</h4>
            <p className="font-medium">Judul: {ppmData.attachments.lkpdTitle}</p>
            {renderMarkdown(ppmData.attachments.lkpdContent)}
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">2. Instrumen/Rubrik Penilaian</h4>
            {renderMarkdown(ppmData.attachments.cognitiveRubric)}
            {renderMarkdown(ppmData.attachments.attitudeRubric)}
            {renderMarkdown(ppmData.attachments.presentationRubric)}
          </div>
        </section>
      </div>
    </div>
  );
};

export default PPMDisplay;