import { useEffect, useMemo, useState } from 'react';
import { FileText, Lock, Plus, Save, Trash2 } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const SESSION_KEY = 'mindbridge_journal_token';

const formatDate = (value) => {
  try {
    return new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
};

const Journal = () => {
  const { t } = useLanguage();
  const token = localStorage.getItem('token');

  const [journalToken, setJournalToken] = useState(() => sessionStorage.getItem(SESSION_KEY) || '');
  const [unlockPassword, setUnlockPassword] = useState('');
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [unlockError, setUnlockError] = useState('');

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const selected = useMemo(() => entries.find((e) => e._id === selectedId) || null, [entries, selectedId]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const refresh = async (jt = journalToken) => {
    if (!token || !jt) return;
    setLoading(true);
    try {
      const data = await api.getJournals(token, jt);
      if (data && typeof data === 'object' && !Array.isArray(data) && data.message) {
        if (String(data.message).toLowerCase().includes('locked')) {
          sessionStorage.removeItem(SESSION_KEY);
          setJournalToken('');
          return;
        }
      }
      setEntries(Array.isArray(data) ? data : []);
      if (!selectedId && Array.isArray(data) && data.length > 0) setSelectedId(data[0]._id);
    } catch (err) {
      const msg = String(err?.message || '');
      // If journal token expired/invalid, lock again.
      if (msg.includes('401') || msg.toLowerCase().includes('locked')) {
        sessionStorage.removeItem(SESSION_KEY);
        setJournalToken('');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (journalToken) refresh(journalToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [journalToken]);

  useEffect(() => {
    if (selected) {
      setTitle(selected.title || '');
      setContent(selected.content || '');
      setError('');
      setSuccess(false);
    } else {
      setTitle('');
      setContent('');
    }
  }, [selected]);

  const unlock = async (e) => {
    e.preventDefault();
    setUnlockLoading(true);
    setUnlockError('');
    try {
      const res = await api.unlockJournal(unlockPassword, token);
      if (res.journalToken) {
        sessionStorage.setItem(SESSION_KEY, res.journalToken);
        setJournalToken(res.journalToken);
        setUnlockPassword('');
      } else {
        setUnlockError(res.message || 'Unable to unlock journal.');
      }
    } catch {
      setUnlockError('Unable to unlock journal. Please try again.');
    } finally {
      setUnlockLoading(false);
    }
  };

  const startNew = () => {
    setSelectedId(null);
    setTitle('');
    setContent('');
    setError('');
    setSuccess(false);
  };

  const save = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      if (!content.trim()) {
        setError('Please write something in your journal.');
        return;
      }
      if (selectedId) {
        const updated = await api.updateJournal(selectedId, { title, content }, token, journalToken);
        if (!updated?._id) {
          setError(updated?.message || 'Unable to save. Please try again.');
          return;
        }
        setEntries((prev) => prev.map((e) => (e._id === selectedId ? updated : e)));
      } else {
        const created = await api.createJournal({ title, content }, token, journalToken);
        if (!created?._id) {
          setError(created?.message || 'Unable to save. Please try again.');
          return;
        }
        setEntries((prev) => [created, ...prev]);
        setSelectedId(created._id);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch {
      setError('Unable to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!selectedId) return;
    if (!window.confirm('Delete this journal entry?')) return;
    setSaving(true);
    setError('');
    try {
      const res = await api.deleteJournal(selectedId, token, journalToken);
      if (!res?.ok) {
        setError(res?.message || 'Unable to delete. Please try again.');
        return;
      }
      setEntries((prev) => prev.filter((e) => e._id !== selectedId));
      setSelectedId(null);
      setTitle('');
      setContent('');
    } catch {
      setError('Unable to delete. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!journalToken) {
    return (
      <div className="space-y-6 animate-fade-in max-w-xl mx-auto">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" /> {t('journal.title', 'Journal')}
          </h1>
          <p className="text-sm text-gray-400 -mt-4">
            {t('journal.lockedSubtitle', 'For privacy, please confirm your password to open your journal.')}
          </p>
        </div>

        <div className="card">
          {unlockError && (
            <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-2xl mb-5 text-sm flex items-center gap-2">
              <span>⚠️</span> {unlockError}
            </div>
          )}
          <form onSubmit={unlock} className="space-y-4">
            <div>
              <label className="label">{t('journal.password', 'Password')}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your account password"
                  required
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {t('journal.note', "We don't store this password. It's only used to unlock your journal for this session.")}
              </p>
            </div>
            <button type="submit" disabled={unlockLoading} className="btn-primary w-full">
              {unlockLoading ? t('journal.unlocking', 'Unlocking...') : t('journal.unlock', 'Unlock Journal')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" /> {t('journal.title', 'Journal')}
          </h1>
          <p className="text-sm text-gray-400 -mt-4">{t('journal.subtitle', 'Write freely. Only you can access your entries.')}</p>
        </div>
        <button onClick={startNew} className="btn-secondary flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t('journal.new', 'New')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card md:col-span-1 p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            {t('journal.entries', 'Entries')}
          </p>
          {loading ? (
            <div className="text-sm text-gray-400">{t('common.loading')}</div>
          ) : entries.length === 0 ? (
            <div className="text-sm text-gray-400">
              {t('journal.noEntries', "No entries yet. Click 'New' to write your first one.")}
            </div>
          ) : (
            <div className="space-y-2">
              {entries.map((e) => {
                const active = e._id === selectedId;
                const preview = String(e.content || '').slice(0, 60);
                return (
                  <button
                    key={e._id}
                    onClick={() => setSelectedId(e._id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      active ? 'border-blue-200 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-700 truncate">{e.title || 'Untitled'}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(e.createdAt)}</p>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{preview}{preview.length >= 60 ? '…' : ''}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="card md:col-span-2">
          <div className="flex items-center justify-between gap-2 flex-wrap mb-4">
            <div className="min-w-0 flex-1">
              <label className="label">{t('journal.titleLabel', 'Title')}</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder={t('journal.titlePlaceholder', 'Optional title')}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="label">{t('journal.entry', 'Entry')}</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field resize-none"
              rows={10}
              placeholder={t('journal.placeholder', "Write what's on your mind...")}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-2xl mb-4 text-sm flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 border border-green-100 text-green-600 px-4 py-3 rounded-2xl mb-4 text-sm">
              ✓ {t('journal.saved', 'Saved')}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" /> {saving ? t('journal.saving', 'Saving...') : t('journal.save', 'Save')}
            </button>
            <button
              onClick={remove}
              disabled={saving || !selectedId}
              className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" /> {t('journal.delete', 'Delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
