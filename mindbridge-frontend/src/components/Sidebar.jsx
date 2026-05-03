import { Home, MessageCircle, BarChart3, Lightbulb, BookOpen, Phone, LogOut, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { to: '/dashboard', icon: Home, label: t('nav.dashboard') },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat') },
    { to: '/mood', icon: BarChart3, label: t('nav.mood') },
    { to: '/recommendations', icon: Lightbulb, label: t('nav.recommendations') },
    { to: '/resources', icon: BookOpen, label: t('nav.resources') },
    { to: '/tele-counseling', icon: Phone, label: t('nav.teleCounseling') },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-sm shadow-soft z-20 hidden md:flex flex-col border-r border-gray-100">
      {/* Logo */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
            <Heart className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">MindBridge</h1>
            <p className="text-xs text-gray-400">{t('nav.tagline')}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 shadow-inner-soft'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              <Icon className={`w-4.5 h-4.5 ${active ? 'text-blue-500' : 'text-gray-400'}`} />
              {label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-2xl text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          {t('nav.signOut')}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
