// src/pages/AdminDashboard.jsx
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UsersView from '../components/admin/UsersView';
import MessagesView from '../components/admin/MessagesView';
import FilesView from '../components/admin/FilesView';
import OverviewView from '../components/admin/OverviewView';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'files', label: 'Files', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'users':
        return <UsersView />;
      case 'messages':
        return <MessagesView />;
      case 'files':
        return <FilesView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Mobile Header */}
          <div className="lg:hidden neu-card p-4 flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="neu-circle w-10 h-10 bg-primary/10">
                <Shield size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-textPrimary text-sm">Admin Panel</p>
                <p className="font-semibold text-textPrimary text-sm truncate max-w-[150px]">
                  {user?.email}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="neu-circle w-10 h-10"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Sidebar */}
          <aside className={`
            lg:w-64 flex-shrink-0
            ${isSidebarOpen ? 'block' : 'hidden lg:block'}
          `}>
            <div className="neu-card p-4 sticky top-24">
              {/* Admin Badge */}
              <div className="hidden lg:flex items-center gap-3 mb-6 pb-6 border-b border-shadowDark/30">
                <div className="neu-circle w-12 h-12 bg-primary/10">
                  <Shield size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-textPrimary">Admin</p>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Super User
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${activeTab === item.id 
                        ? 'neu-pressed text-primary font-medium' 
                        : 'hover:bg-surface text-textSecondary hover:text-textPrimary'
                      }
                    `}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                    {activeTab === item.id && (
                      <ChevronRight size={16} className="ml-auto" />
                    )}
                  </button>
                ))}
              </nav>

              {/* Logout Button */}
              <div className="mt-6 pt-6 border-t border-shadowDark/30">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-all duration-200"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="neu-card min-h-[calc(100vh-200px)]">
              {renderContent()}
            </div>
          </main>

        </div>
      </div>
    </div>
  );
}