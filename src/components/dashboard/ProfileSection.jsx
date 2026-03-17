// src/components/dashboard/ProfileSection.jsx
import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Crown, Edit3, Check } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import Button from '../../components/Button';

export default function ProfileSection() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;
      
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="neu-spinner" />
      </div>
    );
  }

  const memberSince = userData?.createdAt 
    ? format(userData.createdAt.toDate(), 'MMMM yyyy')
    : 'Recently';

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-textPrimary flex items-center gap-2">
          <User size={24} className="text-primary" />
          Profile
        </h2>
        <Button 
          variant="secondary" 
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? (
            <><Check size={16} /> Done</>
          ) : (
            <><Edit3 size={16} /> Edit</>
          )}
        </Button>
      </div>

      {/* Profile Card */}
      <div className="neu-pressed rounded-xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          {/* Avatar */}
          <div className="neu-circle w-24 h-24 text-3xl font-bold text-primary">
            {user?.displayName?.charAt(0) || 'U'}
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-textPrimary mb-1">
              {user?.displayName || 'User'}
            </h3>
            <p className="text-textSecondary">{user?.email}</p>
            <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Crown size={14} />
              {userData?.accountType || 'Free'} Plan
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="neu-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="neu-circle w-8 h-8">
                <User size={14} className="text-primary" />
              </div>
              <span className="text-sm text-textSecondary">Full Name</span>
            </div>
            <p className="font-medium text-textPrimary pl-11">
              {user?.displayName || 'Not set'}
            </p>
          </div>

          <div className="neu-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="neu-circle w-8 h-8">
                <Mail size={14} className="text-primary" />
              </div>
              <span className="text-sm text-textSecondary">Email</span>
            </div>
            <p className="font-medium text-textPrimary pl-11 break-all">
              {user?.email}
            </p>
          </div>

          <div className="neu-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="neu-circle w-8 h-8">
                <Calendar size={14} className="text-primary" />
              </div>
              <span className="text-sm text-textSecondary">Member Since</span>
            </div>
            <p className="font-medium text-textPrimary pl-11">
              {memberSince}
            </p>
          </div>

          <div className="neu-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="neu-circle w-8 h-8">
                <Crown size={14} className="text-primary" />
              </div>
              <span className="text-sm text-textSecondary">Account Type</span>
            </div>
            <p className="font-medium text-textPrimary pl-11">
              {userData?.accountType || 'Free'}
            </p>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="neu-card p-4 text-center">
          <p className="text-2xl font-bold text-primary mb-1">0</p>
          <p className="text-sm text-textSecondary">Active Projects</p>
        </div>
        <div className="neu-card p-4 text-center">
          <p className="text-2xl font-bold text-primary mb-1">0</p>
          <p className="text-sm text-textSecondary">Messages</p>
        </div>
        <div className="neu-card p-4 text-center">
          <p className="text-2xl font-bold text-primary mb-1">0</p>
          <p className="text-sm text-textSecondary">Files Uploaded</p>
        </div>
      </div>
    </div>
  );
}