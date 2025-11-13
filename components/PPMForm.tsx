import React from 'react';
import { PPMFormInputs } from '../types';

interface PPMFormProps {
  formData: PPMFormInputs;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const PPMForm: React.FC<PPMFormProps> = ({ formData, onFormChange, onSubmit, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Form Pengisian PPM</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {Object.entries(formData).map(([key, value]) => {
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          const inputType = key.includes('timeAllocation') ? 'text' : (key.includes('learning') ? 'textarea' : 'text');
          const isSelect = ['phase', 'grade', 'semester'].includes(key);

          return (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                {label.replace('Ppm', 'PPM').replace('Material', 'Materi').replace('Outcomes', 'Capaian').replace('Objectives', 'Tujuan')}
              </label>
              {isSelect ? (
                <select
                  id={key}
                  name={key}
                  value={value as string}
                  onChange={onFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                >
                  <option value="">Pilih {label}</option>
                  {key === 'phase' && (
                    <>
                      <option value="A">Fase A</option>
                      <option value="B">Fase B</option>
                      <option value="C">Fase C</option>
                      <option value="D">Fase D</option>
                      <option value="E">Fase E</option>
                      <option value="F">Fase F</option>
                    </>
                  )}
                  {key === 'grade' && (
                    <>
                      <option value="1">Kelas 1</option>
                      <option value="2">Kelas 2</option>
                      <option value="3">Kelas 3</option>
                      <option value="4">Kelas 4</option>
                      <option value="5">Kelas 5</option>
                      <option value="6">Kelas 6</option>
                      <option value="7">Kelas 7</option>
                      <option value="8">Kelas 8</option>
                      <option value="9">Kelas 9</option>
                      <option value="10">Kelas 10</option>
                      <option value="11">Kelas 11</option>
                      <option value="12">Kelas 12</option>
                    </>
                  )}
                  {key === 'semester' && (
                    <>
                      <option value="Ganjil">Ganjil</option>
                      <option value="Genap">Genap</option>
                    </>
                  )}
                </select>
              ) : inputType === 'textarea' ? (
                <textarea
                  id={key}
                  name={key}
                  value={value as string}
                  onChange={onFormChange}
                  rows={3}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              ) : (
                <input
                  type={inputType}
                  id={key}
                  name={key}
                  value={value as string}
                  onChange={onFormChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              )}
            </div>
          );
        })}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate PPM'}
        </button>
      </form>
    </div>
  );
};

export default PPMForm;
