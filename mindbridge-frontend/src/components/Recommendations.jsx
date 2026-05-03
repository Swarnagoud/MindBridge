import { useState, useEffect } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const cardColors = [
  'from-blue-50 to-blue-100 border-blue-100',
  'from-green-50 to-green-100 border-green-100',
  'from-purple-50 to-purple-100 border-purple-100',
  'from-amber-50 to-amber-100 border-amber-100',
  'from-rose-50 to-rose-100 border-rose-100',
];

const Recommendations = () => {
  const { t } = useLanguage();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => { fetchRecommendations(); }, []);

  const fetchRecommendations = async () => {
    try {
      const data = await api.getRecommendations(token);
      setRecommendations(data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-48">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400" />
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">{t('recommendations.title')}</h1>
        <p className="text-sm text-gray-400 -mt-4">{t('recommendations.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, i) => (
          <div key={i} className={`bg-gradient-to-br ${cardColors[i % cardColors.length]} border rounded-3xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft`}>
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mb-3 shadow-soft">
              <Sparkles className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1.5">{rec.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{rec.description}</p>
            {rec.link && (
              <a href={rec.link} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-blue-600 hover:text-blue-700">
                {t('recommendations.tryIt')} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
