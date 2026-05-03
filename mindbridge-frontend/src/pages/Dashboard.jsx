import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, BarChart3, Lightbulb, BookOpen, Phone, AlertTriangle, ArrowRight } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const moodEmojis = ['😢', '😟', '😐', '😊', '😃'];

const detectRisk = (moods) => {
  if (moods.length < 3) return false;
  const recent = moods.slice(-3);
  return recent.every(m => {
    const score = moodEmojis.indexOf(m.mood) + 1;
    return score > 0 && score <= 2;
  });
};

const featureCards = [
  { to: '/chat', icon: MessageCircle, label: 'AI Chat Support', desc: 'Talk to your empathetic companion', color: 'from-blue-400 to-blue-500', bg: 'bg-blue-50' },
  { to: '/mood', icon: BarChart3, label: 'Mood Tracking', desc: 'Log your daily mood & see trends', color: 'from-sage-400 to-sage-500', bg: 'bg-green-50' },
  { to: '/recommendations', icon: Lightbulb, label: 'Recommendations', desc: 'Personalized wellness tips', color: 'from-yellow-400 to-amber-400', bg: 'bg-yellow-50' },
  { to: '/resources', icon: BookOpen, label: 'Resources', desc: 'Helpful articles & guides', color: 'from-purple-400 to-purple-500', bg: 'bg-purple-50' },
  { to: '/tele-counseling', icon: Phone, label: 'Tele-Counseling', desc: 'Connect with professionals', color: 'from-rose-400 to-rose-500', bg: 'bg-rose-50' },
];

const Dashboard = () => {
  const { t, language } = useLanguage();
  const [recentMood, setRecentMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [riskAlert, setRiskAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      const [moods, recs] = await Promise.all([api.getMoods(token), api.getRecommendations(token)]);
      if (moods.length > 0) {
        setRecentMood(moods[moods.length - 1]);
        setRiskAlert(detectRisk(moods));
      }
      setRecommendations(recs.slice(0, 2));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
          <p className="text-sm text-gray-400">Loading your space...</p>
        </div>
      </div>
    );
  }

  const hour = new Date().getHours();
  const greeting = language === 'hi'
    ? (hour < 12 ? 'सुप्रभात' : hour < 17 ? 'नमस्ते' : 'शुभ संध्या')
    : (hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{greeting} 👋</h1>
        <p className="text-gray-400 text-sm mt-1">{t('dashboard.subtitle')}</p>
      </div>

      {/* Risk Alert */}
      {riskAlert && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-start gap-3 animate-slide-up">
          <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="font-semibold text-amber-800 text-sm">{t('dashboard.lowAlertTitle')}</p>
            <p className="text-amber-600 text-xs mt-1">
              It's okay to not be okay. Consider{' '}
              <Link to="/tele-counseling" className="underline font-medium">talking to someone</Link>
              {' '}or{' '}
              <Link to="/chat" className="underline font-medium">chatting with MindBridge</Link>.
            </p>
          </div>
        </div>
      )}

      {/* Recent Mood */}
      {recentMood && (
        <div className="card flex items-center gap-4">
          <div className="text-4xl">{recentMood.mood}</div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Last logged mood</p>
            <p className="text-sm text-gray-600 mt-0.5">
              {new Date(recentMood.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </p>
            {recentMood.note && <p className="text-xs text-gray-400 mt-1 italic">"{recentMood.note}"</p>}
          </div>
          <Link to="/mood" className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium shrink-0">
            {t('dashboard.logToday')} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}

      {/* Feature Cards */}
      <div>
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{t('dashboard.explore')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {featureCards.map(({ to, icon: Icon, label, desc, color, bg }) => (
            <Link key={to} to={to} className="card-hover group">
              <div className={`w-10 h-10 ${bg} rounded-2xl flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="font-semibold text-gray-700 text-sm">{label}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              <div className="flex items-center gap-1 mt-3 text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {t('common.open')} <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recommendations Preview */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('dashboard.todaysTips')}</p>
            <Link to="/recommendations" className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
              {t('dashboard.viewAll')} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <div key={i} className="card flex items-start gap-3 py-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <div>
                  <p className="font-medium text-gray-700 text-sm">{rec.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
