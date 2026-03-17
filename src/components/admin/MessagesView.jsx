// src/components/admin/MessagesView.jsx
import { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Filter,
  User,
  Mail,
  ExternalLink
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
  { value: 'pending', label: 'Pending', color: 'bg-warning/10 text-warning border-warning/30', icon: Clock },
  { value: 'in-progress', label: 'In Progress', color: 'bg-primary/10 text-primary border-primary/30', icon: AlertCircle },
  { value: 'resolved', label: 'Resolved', color: 'bg-success/10 text-success border-success/30', icon: CheckCircle },
];

export default function MessagesView() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedMessage, setExpandedMessage] = useState(null);
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
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${statusConfig.color}`}>
        <StatusIcon size={14} />
        {statusConfig.label}
      </span>
    );
  };

  const getServiceColor = (service) => {
    const colors = {
      'Web Development': 'bg-blue-500/10 text-blue-600 border-blue-500/30',
      'UI Design': 'bg-purple-500/10 text-purple-600 border-purple-500/30',
      'Portfolio': 'bg-green-500/10 text-green-600 border-green-500/30',
      'Maintenance': 'bg-orange-500/10 text-orange-600 border-orange-500/30',
      'Other': 'bg-gray-500/10 text-gray-600 border-gray-500/30',
    };
    return colors[service] || colors['Other'];
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.service?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: messages.length,
    pending: messages.filter(m => m.status === 'pending' || !m.status).length,
    inProgress: messages.filter(m => m.status === 'in-progress').length,
    resolved: messages.filter(m => m.status === 'resolved').length,
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="neu-card p-8">
          <div className="neu-spinner mx-auto mb-4" />
          <p className="text-textSecondary">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="neu-card p-4 text-center hover-lift">
          <p className="text-2xl font-bold text-textPrimary">{stats.total}</p>
          <p className="text-xs text-textSecondary uppercase tracking-wide">Total</p>
        </div>
        <div className="neu-card p-4 text-center hover-lift">
          <p className="text-2xl font-bold text-warning">{stats.pending}</p>
          <p className="text-xs text-textSecondary uppercase tracking-wide">Pending</p>
        </div>
        <div className="neu-card p-4 text-center hover-lift">
          <p className="text-2xl font-bold text-primary">{stats.inProgress}</p>
          <p className="text-xs text-textSecondary uppercase tracking-wide">In Progress</p>
        </div>
        <div className="neu-card p-4 text-center hover-lift">
          <p className="text-2xl font-bold text-success">{stats.resolved}</p>
          <p className="text-xs text-textSecondary uppercase tracking-wide">Resolved</p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <MessageSquare size={24} className="text-primary" />
          All Messages
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
          <div 
            key={message.id} 
            className={`neu-card p-5 transition-all duration-300 ${
              expandedMessage === message.id ? 'ring-2 ring-primary/30' : ''
            }`}
          >
            {/* Header Row */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getServiceColor(message.service)}`}>
                  {message.service}
                </span>
                {getStatusBadge(message.status || 'pending')}
                {message.isGuest && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-600 border border-gray-500/30">
                    <User size={10} />
                    Guest
                  </span>
                )}
              </div>
              <span className="text-xs text-textSecondary flex items-center gap-1">
                <Clock size={12} />
                {message.createdAt 
                  ? format(message.createdAt.toDate(), 'MMM d, yyyy • h:mm a')
                  : 'Just now'
                }
              </span>
            </div>
            
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3 p-3 neu-pressed rounded-xl">
              <div className="neu-circle w-10 h-10">
                <span className="font-bold text-primary">
                  {message.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-textPrimary truncate">
                  {message.name}
                </p>
                <a 
                  href={`mailto:${message.email}`}
                  className="text-xs text-textSecondary hover:text-primary transition-colors flex items-center gap-1"
                >
                  <Mail size={12} />
                  {message.email}
                </a>
              </div>
              <a 
                href={`mailto:${message.email}`}
                className="neu-circle w-8 h-8 hover:text-primary flex-shrink-0"
                title="Reply via Email"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            
            {/* Message Content */}
            <div className="mb-4">
              <p className={`text-textSecondary text-sm leading-relaxed ${
                expandedMessage === message.id ? '' : 'line-clamp-3'
              }`}>
                {message.message}
              </p>
              {message.message.length > 150 && (
                <button 
                  onClick={() => setExpandedMessage(
                    expandedMessage === message.id ? null : message.id
                  )}
                  className="text-primary text-xs mt-2 hover:underline font-medium"
                >
                  {expandedMessage === message.id ? 'Show Less' : 'Read More'}
                </button>
              )}
            </div>
            
            {/* Status Update Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-shadowDark/20">
              <span className="text-xs text-textSecondary mr-2">Update Status:</span>
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusUpdate(message.id, status.value)}
                  disabled={updating === message.id || message.status === status.value}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                    ${message.status === status.value 
                      ? status.color + ' ring-2 ring-offset-2 ring-offset-background ring-current scale-105' 
                      : 'neu-button hover:scale-105'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  `}
                >
                  {updating === message.id && message.status !== status.value ? (
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <status.icon size={12} />
                      {status.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="neu-pressed rounded-xl p-12 text-center mt-4">
          <div className="neu-circle w-16 h-16 mx-auto mb-4">
            <MessageSquare size={24} className="text-textSecondary" />
          </div>
          <p className="text-textSecondary font-medium">No messages found</p>
          <p className="text-textSecondary text-sm mt-1">
            {searchTerm ? 'Try adjusting your search' : 'Messages will appear here'}
          </p>
        </div>
      )}
    </div>
  );
}