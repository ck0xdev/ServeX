// src/components/admin/FilesView.jsx
import { useState, useEffect } from 'react';
import { FileText, Search, Download, Trash2, User, Clock, Filter, Image, File } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { format } from 'date-fns';

const FILE_ICONS = {
  'image/jpeg': Image,
  'image/png': Image,
  'image/jpg': Image,
  'application/pdf': FileText,
  'text/plain': FileText,
};

export default function FilesView() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'files'),
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (file) => {
    if (!confirm(`Delete "${file.fileName}"? This cannot be undone.`)) return;

    setDeleting(file.id);
    try {
      await deleteDoc(doc(db, 'files', file.id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete file');
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.fileData;
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    return FILE_ICONS[fileType] || File;
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = 
      file.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || file.fileType?.startsWith(typeFilter);
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="neu-spinner" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <FileText size={24} className="text-primary" />
          All Files
          <span className="text-sm font-normal text-textSecondary bg-surface px-3 py-1 rounded-full">
            {files.length}
          </span>
        </h2>
        
        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neu-input pl-10 w-full md:w-64"
            />
          </div>
          
          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="neu-input appearance-none pr-10 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="image/">Images</option>
              <option value="application/pdf">PDFs</option>
              <option value="text/">Text</option>
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => {
          const FileIcon = getFileIcon(file.fileType);
          
          return (
            <div key={file.id} className="neu-card p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="neu-pressed w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileIcon size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-textPrimary truncate" title={file.fileName}>
                    {file.fileName}
                  </p>
                  <p className="text-xs text-textSecondary">{formatFileSize(file.fileSize)}</p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4 text-xs text-textSecondary">
                <div className="flex items-center gap-2">
                  <User size={12} />
                  <span className="truncate">{file.userEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={12} />
                  <span>
                    {file.createdAt 
                      ? format(file.createdAt.toDate(), 'MMM d, yyyy')
                      : 'Unknown'
                    }
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(file)}
                  className="flex-1 neu-button py-2 rounded-lg text-sm flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  Download
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  disabled={deleting === file.id}
                  className="neu-button py-2 px-3 rounded-lg text-error hover:bg-error/10 disabled:opacity-50"
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

      {filteredFiles.length === 0 && (
        <div className="neu-pressed rounded-xl p-8 text-center mt-4">
          <p className="text-textSecondary">No files found</p>
        </div>
      )}
    </div>
  );
}