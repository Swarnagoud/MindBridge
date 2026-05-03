import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Lock } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const Register = ({ onLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    setError('');
    try {
      const response = await api.register(email, password);
      if (response.token) {
        localStorage.setItem('token', response.token);
        onLogin();
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 50%, #f0fdf4 100%)'}}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl shadow-soft-lg mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">MindBridge</h1>
          <p className="text-gray-500 mt-2 text-sm">Your safe space for mental wellness 🌿</p>
        </div>

        {/* Card */}
        <div className="card animate-slide-up">
          <h2 className="text-xl font-semibold text-gray-700 mb-1">{t('auth.createAccount')}</h2>
          <p className="text-sm text-gray-400 mb-6">It only takes a moment. You've got this. ✨</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-2xl mb-5 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="input-field pl-10"
                  placeholder="Min. 6 characters"
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                  className={`input-field pl-10 ${confirmPassword && confirmPassword !== password ? 'border-red-300 focus:ring-red-200' : ''}`}
                  placeholder="••••••••"
                  required
                />
              </div>
              {confirmPassword && confirmPassword !== password && (
                <p className="text-red-400 text-xs mt-1.5 ml-1">Passwords don't match</p>
              )}
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {t('auth.creatingAccount')}
                </span>
              ) : t('auth.getStarted')}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">{t('auth.privacy')}</p>
      </div>
    </div>
  );
};

export default Register;
