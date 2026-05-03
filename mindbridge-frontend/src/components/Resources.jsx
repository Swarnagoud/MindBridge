import { ExternalLink, Play, BookOpen, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const resources = [
  { title: '4-7-8 Breathing Exercise', description: 'A simple breathing technique to reduce stress and anxiety instantly.', link: 'https://www.youtube.com/watch?v=9-_b2nHHfRE', type: 'video', emoji: '🌬️' },
  { title: 'Guided Meditation for Beginners', description: '10-minute guided meditation to calm your mind and find peace.', link: 'https://www.youtube.com/watch?v=86HUcX8TWZs', type: 'video', emoji: '🧘' },
  { title: 'Progressive Muscle Relaxation', description: 'Release tension from your body with this step-by-step technique.', link: 'https://www.youtube.com/watch?v=2OEL4P1Rz04', type: 'video', emoji: '💆' },
  { title: 'Mental Health Resources in India', description: 'Comprehensive list of mental health services and support centers.', link: 'https://www.nimhans.ac.in/', type: 'article', emoji: '🏥' },
  { title: 'Crisis Helplines', description: '24/7 support for mental health emergencies. You are not alone.', link: 'https://www.aasra.info/helpline.html', type: 'helpline', emoji: '📞' },
  { title: 'Mindfulness Apps', description: 'Apps for daily mindfulness and meditation practice.', link: 'https://www.headspace.com/', type: 'app', emoji: '📱' },
];

const typeConfig = {
  video: { label: 'Video', bg: 'bg-red-50', text: 'text-red-500' },
  article: { label: 'Article', bg: 'bg-blue-50', text: 'text-blue-500' },
  helpline: { label: 'Helpline', bg: 'bg-green-50', text: 'text-green-600' },
  app: { label: 'App', bg: 'bg-purple-50', text: 'text-purple-500' },
};

const Resources = () => {
  const { t } = useLanguage();

  return (
  <div className="space-y-6 animate-fade-in">
    <div>
      <h1 className="page-title">{t('resources.title')}</h1>
      <p className="text-sm text-gray-400 -mt-4">{t('resources.subtitle')}</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {resources.map((r, i) => {
        const type = typeConfig[r.type];
        return (
          <div key={i} className="card-hover">
            <div className="flex items-start gap-4">
              <div className="text-3xl">{r.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-700 text-sm">{r.title}</h3>
                  <span className={`badge ${type.bg} ${type.text}`}>{type.label}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{r.description}</p>
                <a href={r.link} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  {t('resources.openResource')} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
  );
};

export default Resources;
