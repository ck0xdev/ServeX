// src/components/FileUpload.jsx - Base64 Version (No Storage Needed)
import { useState, useCallback } from 'react';
import { Upload, X, File, Image, FileText, Archive, AlertCircle, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

const ALLOWED_TYPES = {
  'image/jpeg': { icon: Image, label: 'Image', maxSize: 500 * 1024 },      // 500KB
  'image/png': { icon: Image, label: 'Image', maxSize: 500 * 1024 },       // 500KB
  'image/jpg': { icon: Image, label: 'Image', maxSize: 500 * 1024 },      // 500KB
  'application/pdf': { icon: FileText, label: 'PDF', maxSize: 1000 * 1024 }, // 1MB
  'text/plain': { icon: FileText, label: 'Text', maxSize: 100 * 1024 },    // 100KB
};

export default function FileUpload({ onUploadSuccess }) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [base64Data, setBase64Data] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validateFile = (file) => {
    const typeConfig = ALLOWED_TYPES[file.type];
    if (!typeConfig) {
      return 'Invalid file type. Allowed: JPG, PNG, PDF, TXT';
    }
    if (file.size > typeConfig.maxSize) {
      return `File too large. Maximum size for ${typeConfig.label}: ${(typeConfig.maxSize / 1024).toFixed(0)}KB`;
    }
    return null;
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(false);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    // Read as Base64 for upload
    try {
      const base64 = await readFileAsBase64(file);
      setBase64Data(base64);
    } catch (err) {
      setError('Failed to read file');
      console.error(err);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect({ target: { files: [file] } });
    }
  }, [handleFileSelect]);

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setBase64Data(null);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!selectedFile || !base64Data || !user) return;

    setIsUploading(true);
    setError(null);

    try {
      // Save file data directly to Firestore as Base64
      await addDoc(collection(db, 'files'), {
        userId: user.uid,
        userEmail: user.email,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileData: base64Data, // Base64 encoded file
        createdAt: serverTimestamp(),
      });

      setSuccess(true);
      setIsUploading(false);
      
      // Clear after delay
      setTimeout(() => {
        clearSelection();
        onUploadSuccess?.();
      }, 1500);
    } catch (err) {
      setError('Upload failed. File may be too large.');
      setIsUploading(false);
      console.error('Upload error:', err);
    }
  };

  const FileTypeIcon = selectedFile 
    ? (ALLOWED_TYPES[selectedFile.type]?.icon || File)
    : Upload;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {!selectedFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="neu-pressed rounded-xl border-2 border-dashed border-textSecondary/30 p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => document.getElementById('file-input').click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".jpg,.jpeg,.png,.pdf,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="neu-circle w-16 h-16 mx-auto mb-4">
            <Upload size={28} className="text-primary" />
          </div>
          <p className="text-textPrimary font-medium mb-2">
            Drop your file here, or click to browse
          </p>
          <p className="text-textSecondary text-sm">
            Images: 500KB max | PDF: 1MB max | TXT: 100KB max
          </p>
        </div>
      ) : (
        /* Selected File Preview */
        <div className="neu-card p-6">
          <div className="flex items-start gap-4">
            {/* Preview or Icon */}
            <div className="neu-pressed rounded-xl w-20 h-20 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <FileTypeIcon size={32} className="text-primary" />
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-textPrimary truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-textSecondary">
                    {(selectedFile.size / 1024).toFixed(2)} KB • {
                      ALLOWED_TYPES[selectedFile.type]?.label || 'File'
                    }
                  </p>
                </div>
                {!isUploading && (
                  <button
                    onClick={clearSelection}
                    className="neu-circle w-8 h-8 flex-shrink-0 hover:text-error transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Success Message */}
              {success && (
                <div className="flex items-center gap-2 mt-4 text-success">
                  <Check size={18} />
                  <span className="text-sm font-medium">Upload successful!</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="flex items-center gap-2 mt-4 text-error">
                  <AlertCircle size={18} />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Upload Button */}
          {!isUploading && !success && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={handleUpload}
                loading={isUploading}
              >
                Upload File
                <Upload size={16} />
              </Button>
            </div>
          )}
          
          {isUploading && (
            <div className="mt-4 flex justify-end">
              <div className="flex items-center gap-2 text-textSecondary">
                <div className="neu-spinner" />
                <span className="text-sm">Uploading...</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}