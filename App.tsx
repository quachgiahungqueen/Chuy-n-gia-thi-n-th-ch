
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeStone } from './services/geminiService';
import { MeteorIcon } from './components/icons';

const App: React.FC = () => {
  const [image, setImage] = useState<{ file: File; dataUrl: string } | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File, dataUrl: string) => {
    setImage({ file, dataUrl });
    setAnalysis(null);
    setError(null);
  };
  
  const handleAnalyze = useCallback(async () => {
    if (!image) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeStone(image.dataUrl);
      setAnalysis(result);
    } catch (err) {
      setError('Đã xảy ra lỗi trong quá trình phân tích. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [image]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <MeteorIcon className="w-12 h-12 text-cyan-400" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Chuyên Gia Thiên Thạch AI
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tải lên hình ảnh một viên đá để AI phân tích và xác định liệu đó là thiên thạch, đá quý hay đá thường, cùng với ước tính giá trị.
          </p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <ImageUploader onImageUpload={handleImageUpload} />
              <button
                onClick={handleAnalyze}
                disabled={!image || isLoading}
                className="mt-6 w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
              >
                {isLoading ? 'Đang phân tích...' : 'Phân Tích Hình Ảnh'}
              </button>
            </div>
            
            <AnalysisResult
              analysis={analysis}
              isLoading={isLoading}
              error={error}
              hasImage={!!image}
            />
          </div>
        </main>
        <footer className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} AI Meteorite Expert. Được cung cấp bởi Gemini AI.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
