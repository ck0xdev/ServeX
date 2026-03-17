// src/components/dashboard/FilesSection.jsx
import { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import FileUpload from '../../components/FileUpload';
import FileList from '../../components/FileList';

export default function FilesSection() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger refresh of file list
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <FileText size={24} className="text-primary" />
          My Files
        </h2>
      </div>

      {/* Upload Section */}
      <div className="mb-8">
        <h3 className="font-medium text-textPrimary mb-4 flex items-center gap-2">
          <Upload size={18} className="text-primary" />
          Upload New File
        </h3>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* File List */}
      <FileList refresh={refreshKey} />
    </div>
  );
}