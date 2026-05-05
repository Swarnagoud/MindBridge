import { Home, MessageCircle, BarChart3, FileText, Lightbulb, BookOpen, Phone, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = ({ onLogout }) => {
  const location = useLocation();
  const { t } = useLanguage();
  const navItems = [
    { to: '/dashboard', icon: Home, label: t('nav.home') },
    { to: '/chat', icon: MessageCircle, label: t('nav.chat') },
    { to: '/mood', icon: BarChart3, label: t('nav.mood') },
    { to: '/journal', icon: FileText, label: t('nav.journal', 'Journal') },
    { to: '/recommendations', icon: Lightbulb, label: t('nav.tips') },
    { to: '/resources', icon: BookOpen, label: t('nav.resources') },
    { to: '/tele-counseling', icon: Phone, label: t('nav.help') },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-100 z-20 md:hidden">
      <div className="flex items-stretch gap-1 px-1.5 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] overflow-x-auto no-scrollbar">
        {navItems.map(({ to, icon: Icon, label }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all duration-200 min-w-[72px] flex-1 ${
                active ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${active ? 'bg-blue-50' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onLogout}
          className="flex flex-col items-center justify-center gap-0.5 px-2 py-1.5 rounded-2xl transition-all duration-200 text-gray-400 hover:text-red-500 min-w-[72px] flex-1"
          aria-label={t('nav.signOut')}
          title={t('nav.signOut')}
        >
          <div className="p-1.5 rounded-xl transition-all duration-200 hover:bg-red-50">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-medium">{t('nav.signOut')}</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
