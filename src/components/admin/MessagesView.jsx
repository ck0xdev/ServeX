// src/components/admin/MessagesView.jsx
import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Filter,
  ChevronDown,
  X
} from 'lucide-react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { format } from 'date-fns';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', color: 'bg-warning/10 text-warning', icon: Clock },
  { value: 'in-progress', label: 'In Progress', color: 'bg-primary/10 text-primary', icon: AlertCircle },
  { value: 'resolved', label: 'Resolved', color: 'bg-success/10 text-success', icon: CheckCircle },
];

export default function MessagesView() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesData);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching messages:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (messageId, newStatus) => {
    setUpdating(messageId);
    try {
      await updateDoc(doc(db, 'messages', messageId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
    const StatusIcon = statusConfig.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
        <StatusIcon size={12} />
        {statusConfig.label}
      </span>
    );
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.service?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
          <MessageSquare size={24} className="text-primary" />
          All Messages
          <span className="text-sm font-normal text-textSecondary bg-surface px-3 py-1 rounded-full">
            {messages.length}
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
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="neu-input pl-10 w-full md:w-64"
            />
          </div>
          
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="neu-input appearance-none pr-10 cursor-pointer"
            >
              <option value="all">All Status</option>
              {STATUS_OPTIONS.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <div key={message.id} className="neu-card p-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-surface text-textSecondary">
                  {message.service}
                </span>
                {getStatusBadge(message.status || 'pending')}
              </div>
              <span className="text-xs text-textSecondary">
                {message.createdAt 
                  ? format(message.createdAt.toDate(), 'MMM d, yyyy • h:mm a')
                  : 'Just now'
                }
              </span>
            </div>
            
            <div className="mb-3">
              <p className="font-medium text-textPrimary">
                {message.name} 
                <span className="text-textSecondary font-normal text-sm ml-2">
                  ({message.email})
                </span>
              </p>
            </div>
            
            <p className="text-textSecondary text-sm mb-4 line-clamp-2">
              {message.message}
            </p>
            
            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-shadowDark/20">
              <span className="text-xs text-textSecondary mr-2">Update Status:</span>
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusUpdate(message.id, status.value)}
                  disabled={updating === message.id || message.status === status.value}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${message.status === status.value 
                      ? status.color + ' ring-2 ring-offset-1 ring-current' 
                      : 'neu-button hover:bg-surface'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {updating === message.id ? '...' : status.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="neu-pressed rounded-xl p-8 text-center mt-4">
          <p className="text-textSecondary">No messages found</p>
        </div>
      )}
    </div>
  );
}