// src/components/admin/OverviewView.jsx
import { useState, useEffect } from 'react';
import { Users, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

export default function OverviewView() {
  const [stats, setStats] = useState({
    users: 0,
    messages: 0,
    files: 0,
    loading: true,
  });

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setStats(prev => ({ ...prev, users: snap.size }));
    });

    const unsubscribeMessages = onSnapshot(collection(db, 'messages'), (snap) => {
      setStats(prev => ({ ...prev, messages: snap.size }));
    });

    const unsubscribeFiles = onSnapshot(collection(db, 'files'), (snap) => {
      setStats(prev => ({ ...prev, files: snap.size, loading: false }));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeMessages();
      unsubscribeFiles();
    };
  }, []);

  const statCards = [
    { 
      label: 'Total Users', 
      value: stats.users, 
      icon: Users, 
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    { 
      label: 'Total Messages', 
      value: stats.messages, 
      icon: MessageSquare, 
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    { 
      label: 'Total Files', 
      value: stats.files, 
      icon: FileText, 
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <h2 className="text-2xl font-bold text-textPrimary mb-8 flex items-center gap-2">
        <TrendingUp size={24} className="text-primary" />
        Dashboard Overview
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="neu-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`neu-circle w-12 h-12 ${stat.bg}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <span className="text-3xl font-bold text-textPrimary">
                {stats.loading ? '-' : stat.value}
              </span>
            </div>
            <p className="text-textSecondary font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 neu-pressed rounded-xl p-6">
        <h3 className="font-semibold text-textPrimary mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="neu-card p-4">
            <p className="text-sm text-textSecondary mb-1">Admin Email</p>
            <p className="font-medium text-textPrimary">admin.serveX@gmail.com</p>
          </div>
          <div className="neu-card p-4">
            <p className="text-sm text-textSecondary mb-1">System Status</p>
            <p className="font-medium text-success flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Operational
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}