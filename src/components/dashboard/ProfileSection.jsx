// src/components/dashboard/ProfileSection.jsx
import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Crown, Edit3, Check, X, Loader } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import Button from '../../components/Button';

export default function ProfileSection() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [editData, setEditData] = useState({ displayName: '' });

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

  const handleEditStart = () => {
    setEditData({ displayName: user?.displayName || '' });
    setSaveError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveError('');
  };

  const handleSave = async () => {
    if (!editData.displayName.trim()) {
      setSaveError('Name cannot be empty');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: editData.displayName.trim() });

      // Update Firestore user doc
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: editData.displayName.trim(),
      });

      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveError('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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

        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleCancel} disabled={isSaving}>
              <X size={16} /> Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={handleEditStart}>
            <Edit3 size={16} /> Edit
          </Button>
        )}
      </div>

      {/* Save Error */}
      {saveError && (
        <div className="mb-4 p-3 rounded-xl bg-error/10 border border-error/30 text-error text-sm">
          {saveError}
        </div>
      )}

      {/* Profile Card */}
      <div className="neu-pressed rounded-xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
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
          {/* Full Name — editable */}
          <div className="neu-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="neu-circle w-8 h-8">
                <User size={14} className="text-primary" />
              </div>
              <span className="text-sm text-textSecondary">Full Name</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editData.displayName}
                onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                className="neu-input text-sm font-medium text-textPrimary w-full ml-11"
                placeholder="Enter your name"
                autoFocus
              />
            ) : (
              <p className="font-medium text-textPrimary pl-11">
                {user?.displayName || 'Not set'}
              </p>
            )}
          </div>

          {/* Email — read only */}
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

          {/* Member Since — read only */}
          <div className="neu-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="neu-circle w-8 h-8">
                <Calendar size={14} className="text-primary" />
              </div>
              <span className="text-sm text-textSecondary">Member Since</span>
            </div>
            <p className="font-medium text-textPrimary pl-11">{memberSince}</p>
          </div>

          {/* Account Type — read only */}
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