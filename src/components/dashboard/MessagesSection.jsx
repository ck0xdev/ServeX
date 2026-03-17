// src/components/dashboard/MessagesSection.jsx
import { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, AlertCircle, Inbox } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

export default function MessagesSection() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    // Real-time listener for messages
    const q = query(
      collection(db, 'messages'),
      where('email', '==', user.email),
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
  }, [user]);

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-warning/10 text-warning',
      'in-progress': 'bg-primary/10 text-primary',
      resolved: 'bg-success/10 text-success',
    };

    const icons = {
      pending: Clock,
      'in-progress': AlertCircle,
      resolved: CheckCircle,
    };

    const StatusIcon = icons[status] || Clock;
    const displayStatus = status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        <StatusIcon size={12} />
        {displayStatus}
      </span>
    );
  };

  const getServiceColor = (service) => {
    const colors = {
      'Web Development': 'bg-blue-500/10 text-blue-600',
      'UI Design': 'bg-purple-500/10 text-purple-600',
      'Portfolio': 'bg-green-500/10 text-green-600',
      'Maintenance': 'bg-orange-500/10 text-orange-600',
      'Other': 'bg-gray-500/10 text-gray-600',
    };
    return colors[service] || colors['Other'];
  };

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
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <MessageSquare size={24} className="text-primary" />
          My Messages
        </h2>
        <span className="text-sm text-textSecondary">
          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </span>
      </div>

      {messages.length === 0 ? (
        // Empty State
        <div className="neu-pressed rounded-xl p-12 text-center">
          <div className="neu-circle w-20 h-20 mx-auto mb-4">
            <Inbox size={32} className="text-textSecondary" />
          </div>
          <h3 className="text-lg font-medium text-textPrimary mb-2">No messages yet</h3>
          <p className="text-textSecondary max-w-sm mx-auto mb-6">
            You haven't sent any messages yet. Contact us to start a conversation about your project.
          </p>
          <a href="/contact" className="text-primary font-medium hover:underline">
            Send a message
          </a>
        </div>
      ) : (
        // Messages List
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="neu-card p-5 hover:translate-y-[-2px] transition-transform">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getServiceColor(message.service)}`}>
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
              
              <p className="text-textPrimary font-medium mb-2">
                From: {message.name}
              </p>
              
              <p className="text-textSecondary text-sm line-clamp-2">
                {message.message.length > 100 
                  ? `${message.message.substring(0, 100)}...` 
                  : message.message
                }
              </p>
              
              {message.message.length > 100 && (
                <button className="text-primary text-sm mt-2 hover:underline">
                  Read more
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}