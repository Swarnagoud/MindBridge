import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const moodEmojis = ['😢', '😟', '😐', '😊', '😃'];
const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Great'];
const moodColors = ['#f87171', '#fb923c', '#94a3b8', '#4ade80', '#60a5fa'];

const MoodTracker = () => {
  const { t } = useLanguage();
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [days, setDays] = useState(7);
  const token = localStorage.getItem('token');

  useEffect(() => { fetchMoods(); }, []);

  const fetchMoods = async () => {
    try {
      const data = await api.getMoods(token);
      setMoods(data);
    } catch (error) { console.error(error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addMood(mood, note, token);
      setMood(''); setNote('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchMoods();
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const filteredMoods = moods.filter(m => new Date(m.date) >= cutoff);

  const chartData = {
    labels: filteredMoods.map(m => new Date(m.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
    datasets: [{
      label: 'Mood',
      data: filteredMoods.map(m => { const i = moodEmojis.indexOf(m.mood); return i !== -1 ? i + 1 : 3; }),
      borderColor: '#60a5fa',
      backgroundColor: 'rgba(96, 165, 250, 0.1)',
      tension: 0.4, fill: true,
      pointRadius: 6, pointHoverRadius: 8,
      pointBackgroundColor: filteredMoods.map(m => moodColors[moodEmojis.indexOf(m.mood)] || '#94a3b8'),
      pointBorderColor: '#fff', pointBorderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 1, max: 5,
        ticks: { stepSize: 1, callback: (v) => moodLabels[v - 1] ?? v, font: { size: 11 } },
        grid: { color: 'rgba(0,0,0,0.04)' }
      },
      x: { grid: { display: false }, ticks: { font: { size: 11 } } }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'white', titleColor: '#374151', bodyColor: '#6b7280',
        borderColor: '#e5e7eb', borderWidth: 1, padding: 10, cornerRadius: 12,
        callbacks: { label: (ctx) => `${moodEmojis[ctx.raw - 1]} ${moodLabels[ctx.raw - 1]}` }
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">{t('mood.title')}</h1>
        <p className="text-sm text-gray-400 -mt-4">{t('mood.subtitle')}</p>
      </div>

      {/* Log Mood Card */}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <p className="text-sm font-medium text-gray-600 mb-4">{t('mood.selectMood')}</p>
          <div className="flex justify-center gap-3 mb-5">
            {moodEmojis.map((emoji, i) => (
              <button
                key={i} type="button" title={moodLabels[i]}
                onClick={() => setMood(emoji)}
                className={`text-3xl p-2.5 rounded-2xl transition-all duration-200 ${
                  mood === emoji
                    ? 'bg-blue-50 ring-2 ring-blue-300 scale-110 shadow-soft'
                    : 'hover:bg-gray-50 hover:scale-105'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          {mood && (
            <p className="text-center text-xs text-gray-400 mb-4 animate-fade-in">
              Feeling <span className="font-medium text-gray-600">{moodLabels[moodEmojis.indexOf(mood)]}</span> {mood}
            </p>
          )}
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input-field resize-none mb-4"
            rows={3}
            placeholder="Add a note... (optional) What's on your mind?"
          />
          {success && (
            <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-2.5 rounded-2xl mb-3 text-sm text-center animate-fade-in">
              ✓ Mood logged! You're doing great. 🌿
            </div>
          )}
          <button type="submit" disabled={loading || !mood} className="btn-primary w-full">
            {loading ? t('mood.saving') : t('mood.save')}
          </button>
        </form>
      </div>

      {/* Chart */}
      {moods.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title mb-0">{t('mood.trend')}</h2>
            <div className="flex gap-1.5">
              {[7, 30].map(d => (
                <button key={d} onClick={() => setDays(d)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    days === d ? 'bg-blue-500 text-white shadow-soft' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
          {filteredMoods.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">{t('mood.noEntries')} {days} {t('mood.days')}</p>
          ) : (
            <Line data={chartData} options={chartOptions} />
          )}
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
