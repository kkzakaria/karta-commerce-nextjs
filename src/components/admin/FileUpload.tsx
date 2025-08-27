'use client';

import { useState } from 'react';

interface FileUploadProps {
  productId: string;
  fileType: 'image' | 'pdf';
  label: string;
  accept: string;
  onUploadSuccess?: (fileUrl: string) => void;
}

export default function FileUpload({ 
  productId, 
  fileType, 
  label, 
  accept, 
  onUploadSuccess 
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'success' | 'error' | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId);
      formData.append('fileType', fileType);

      const token = localStorage.getItem('admin-token');
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur lors du téléchargement');
      }

      setUploadStatus('success');
      onUploadSuccess?.(result.fileUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept={accept}
          onChange={handleFileUpload}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-medium
            file:bg-qaski-red-primary file:text-white
            hover:file:bg-red-700
            disabled:opacity-50"
        />
        
        {isUploading && (
          <span className="text-sm text-gray-600">Téléchargement...</span>
        )}
      </div>
      
      {uploadStatus === 'success' && (
        <p className="text-sm text-green-600">Fichier téléchargé avec succès</p>
      )}
      
      {uploadStatus === 'error' && (
        <p className="text-sm text-red-600">Erreur lors du téléchargement</p>
      )}
    </div>
  );
}