// src/components/FileList.jsx - Base64 Version
import { useState, useEffect } from 'react';
import { 
  File, 
  Image, 
  FileText, 
  Download, 
  Trash2, 
  ExternalLink,
  Clock,
  AlertCircle,
  Eye
} from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

const FILE_ICONS = {
  'image/jpeg': Image,
  'image/png': Image,
  'image/jpg': Image,
  'application/pdf': FileText,
  'text/plain': FileText,
};

export default function FileList({ refresh }) {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [viewingFile, setViewingFile] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'files'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const filesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFiles(filesData);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching files:', err);
      setError('Failed to load files');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, refresh]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDelete = async (file) => {
    if (!confirm(`Are you sure you want to delete "${file.fileName}"?`)) return;

    setDeleting(file.id);
    try {
      await deleteDoc(doc(db, 'files', file.id));
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete file');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = (file) => {
    // Create download link from Base64 data
    const link = document.createElement('a');
    link.href = file.fileData;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (file) => {
    if (file.fileType.startsWith('image/') || file.fileType === 'text/plain') {
      setViewingFile(file);
    } else {
      // For PDFs, open in new tab
      const newWindow = window.open();
      newWindow.document.write(`
        <iframe src="${file.fileData}" width="100%" height="100%" style="border:none;"></iframe>
      `);
    }
  };

  const closeViewer = () => {
    setViewingFile(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="neu-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="neu-pressed rounded-xl p-6 text-center">
        <AlertCircle size={32} className="text-error mx-auto mb-2" />
        <p className="text-error">{error}</p>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="neu-pressed rounded-xl p-8 text-center">
        <div className="neu-circle w-16 h-16 mx-auto mb-4">
          <File size={24} className="text-textSecondary" />
        </div>
        <h3 className="font-medium text-textPrimary mb-1">No files yet</h3>
        <p className="text-textSecondary text-sm">
          Upload your first file above
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="font-semibold text-textPrimary mb-4 flex items-center gap-2">
          <File size={18} className="text-primary" />
          Your Files ({files.length})
        </h3>

        <div className="grid gap-4">
          {files.map((file) => {
            const FileIcon = FILE_ICONS[file.fileType] || File;
            
            return (
              <div key={file.id} className="neu-card p-4 flex items-center gap-4 group">
                {/* File Icon */}
                <div className="neu-pressed w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileIcon size={20} className="text-primary" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-textPrimary truncate" title={file.fileName}>
                    {file.fileName}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-textSecondary">
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {file.createdAt 
                        ? format(file.createdAt.toDate(), 'MMM d, yyyy')
                        : 'Just now'
                      }
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {/* View button for images and text */}
                  {(file.fileType.startsWith('image/') || file.fileType === 'text/plain') && (
                    <button
                      onClick={() => handleView(file)}
                      className="neu-circle w-9 h-9 hover:text-primary transition-colors"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDownload(file)}
                    className="neu-circle w-9 h-9 hover:text-primary transition-colors"
                    title="Download"
                  >
                    <Download size={16} />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(file)}
                    disabled={deleting === file.id}
                    className="neu-circle w-9 h-9 hover:text-error transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === file.id ? (
                      <div className="w-4 h-4 border-2 border-error border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* File Viewer Modal */}
      {viewingFile && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={closeViewer}
        >
          <div 
            className="neu-card max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-shadowDark/30">
              <h3 className="font-semibold text-textPrimary truncate max-w-md">
                {viewingFile.fileName}
              </h3>
              <button 
                onClick={closeViewer}
                className="neu-circle w-8 h-8 hover:text-error"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              {viewingFile.fileType.startsWith('image/') ? (
                <img 
                  src={viewingFile.fileData} 
                  alt={viewingFile.fileName}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              ) : viewingFile.fileType === 'text/plain' ? (
                <pre className="bg-surface p-4 rounded-xl overflow-auto max-h-[70vh] text-sm text-textPrimary whitespace-pre-wrap">
                  {atob(viewingFile.fileData.split(',')[1])}
                </pre>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}