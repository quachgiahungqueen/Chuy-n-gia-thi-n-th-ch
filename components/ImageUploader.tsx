import React, { useState, useCallback } from 'react';
// Fix: Removed unused and non-existent ImageIcon import.
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File, dataUrl: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);
        onImageUpload(file, dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  
  const onDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  }, [handleFileChange]);

  return (
    <div className="flex-grow flex flex-col">
      <label
        htmlFor="file-upload"
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`relative flex-grow flex flex-col justify-center items-center w-full border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 ease-in-out
        ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-600 hover:border-cyan-500 bg-gray-800'}`}
      >
        {preview ? (
          <img src={preview} alt="Xem trước" className="object-contain h-full w-full max-h-80 rounded-lg p-2" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold text-cyan-400">Nhấn để tải lên</span> hoặc kéo thả
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP (Tối đa 5MB)</p>
          </div>
        )}
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={(e) => handleFileChange(e.target.files)}
        />
      </label>
    </div>
  );
};
