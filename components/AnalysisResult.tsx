
import React from 'react';
import { SparklesIcon, AlertTriangleIcon, SearchIcon } from './icons';

interface AnalysisResultProps {
  analysis: string | null;
  isLoading: boolean;
  error: string | null;
  hasImage: boolean;
}

const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4 animate-pulse">
        <div className="h-6 bg-gray-600 rounded w-1/3"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-6 bg-gray-600 rounded w-1/4 mt-6"></div>
        <div className="h-4 bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-700 rounded w-4/6"></div>
    </div>
);


export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, isLoading, error, hasImage }) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingSkeleton />;
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-red-400">
          <AlertTriangleIcon className="w-12 h-12 mb-4" />
          <p className="font-semibold">Lỗi Phân Tích</p>
          <p className="text-sm">{error}</p>
        </div>
      );
    }

    if (analysis) {
        const sections = analysis.split(/\n(?=[A-Z0-9.\s]+:)/).map(section => {
            const parts = section.split(/:(.*)/s);
            return {
                title: parts[0]?.trim(),
                content: parts[1]?.trim()
            };
        });

      return (
        <div className="prose prose-invert prose-p:text-gray-300 prose-headings:text-cyan-400 prose-strong:text-white">
            {sections.map((sec, index) => (
                <div key={index}>
                    <h2>{sec.title}</h2>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{sec.content}</p>
                </div>
            ))}
        </div>
      );
    }

    if (!hasImage) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-gray-500">
                <SearchIcon className="w-12 h-12 mb-4" />
                <p className="font-semibold">Sẵn sàng để phân tích</p>
                <p className="text-sm">Vui lòng tải lên một hình ảnh để bắt đầu.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center text-center text-gray-400">
            <SparklesIcon className="w-12 h-12 mb-4" />
            <p className="font-semibold">Chờ lệnh phân tích</p>
            <p className="text-sm">Nhấn nút "Phân Tích Hình Ảnh" để AI bắt đầu làm việc.</p>
        </div>
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg h-full min-h-[300px] flex flex-col justify-center overflow-y-auto">
        {renderContent()}
    </div>
    );
};
