// src/components/admin/UsersView.jsx
import { useState, useEffect } from 'react';
import { Users, Search, Calendar, Mail, User } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { format } from 'date-fns';

export default function UsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching users:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Users size={24} className="text-primary" />
          All Users
          <span className="text-sm font-normal text-textSecondary bg-surface px-3 py-1 rounded-full">
            {users.length}
          </span>
        </h2>
        
        {/* Search */}
        <div className="relative max-w-sm">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neu-input pl-10 w-full"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-shadowDark/30">
              <th className="text-left py-3 px-4 font-semibold text-textPrimary">User</th>
              <th className="text-left py-3 px-4 font-semibold text-textPrimary">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-textPrimary">Joined</th>
              <th className="text-left py-3 px-4 font-semibold text-textPrimary">Type</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-shadowDark/20 hover:bg-surface/50 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="neu-circle w-10 h-10">
                      <span className="font-bold text-primary">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <span className="font-medium text-textPrimary">{user.name || 'Unknown'}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-textSecondary">
                    <Mail size={14} />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 text-textSecondary text-sm">
                    <Calendar size={14} />
                    {user.createdAt 
                      ? format(user.createdAt.toDate(), 'MMM d, yyyy')
                      : 'Unknown'
                    }
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {user.accountType || 'Free'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="neu-pressed rounded-xl p-8 text-center mt-4">
          <p className="text-textSecondary">No users found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}