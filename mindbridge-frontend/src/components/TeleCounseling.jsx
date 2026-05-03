import { useState, useEffect } from 'react';
import { Phone, Calendar, Clock, ChevronRight, X, CheckCircle, Heart } from 'lucide-react';
import api from '../utils/api';
import { useLanguage } from '../context/LanguageContext';

const helplines = [
  { name: 'Tele MANAS', number: '14416', alt: '1-800-891-4416', description: '24/7 multi-language support' },
  { name: 'Vandrevala Foundation', number: '9999666555', description: 'Mental health helpline' },
  { name: 'iCALL', number: '9152987821', description: 'Psychosocial helpline' }
];

const TeleCounseling = () => {
  const { t } = useLanguage();
  const [counselors, setCounselors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('book');

  const token = localStorage.getItem('token');
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [c, b] = await Promise.all([api.getCounselors(token), api.getBookings(token)]);
      setCounselors(c);
      setBookings(b);
    } catch (err) { console.error(err); }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await api.createBooking({ counselorId: selected._id, date, slot, reason }, token);
      if (res._id) {
        setSuccess(true);
        setSelected(null); setDate(''); setSlot(''); setReason('');
        fetchData();
        setTimeout(() => { setSuccess(false); setTab('appointments'); }, 1500);
      } else {
        setError(res.message || 'Booking failed.');
      }
    } catch { setError('Unable to book. Please try again.'); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    await api.cancelBooking(id, token);
    fetchData();
  };

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status !== 'upcoming');

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">{t('tele.title')}</h1>
        <p className="text-sm text-gray-400 -mt-4">{t('tele.subtitle')}</p>
      </div>

      {/* Emergency Helplines */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 bg-red-50 rounded-xl flex items-center justify-center">
            <Phone className="w-3.5 h-3.5 text-red-500" />
          </div>
          <h2 className="section-title mb-0">{t('tele.emergency')}</h2>
        </div>
        <div className="space-y-3">
          {helplines.map((h, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-3.5 flex items-center justify-between gap-3">
              <div>
                <p className="font-medium text-gray-700 text-sm">{h.name}</p>
                <p className="text-xs text-gray-400">{h.description}</p>
                {h.alt && <p className="text-xs text-gray-400">Also: {h.alt}</p>}
              </div>
              <div className="flex flex-col gap-1.5 items-end shrink-0">
                <a href={`tel:${h.number}`} className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-green-600 transition-colors">
                  <Phone className="w-3 h-3" /> {h.number}
                </a>
                {h.alt && (
                  <a href={`tel:${h.alt}`} className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-xl text-xs font-medium hover:bg-green-200 transition-colors">
                    <Phone className="w-3 h-3" /> {h.alt}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['book', 'appointments'].map(tabKey => (
          <button key={tabKey} onClick={() => setTab(tabKey)}
            className={`px-5 py-2 rounded-2xl text-sm font-medium transition-all duration-200 ${
              tab === tabKey ? 'bg-blue-500 text-white shadow-soft' : 'bg-white text-gray-500 shadow-soft hover:bg-gray-50'
            }`}
          >
            {tabKey === 'book' ? t('tele.bookSession') : `${t('tele.myAppointments')}${upcomingBookings.length > 0 ? ` (${upcomingBookings.length})` : ''}`}
          </button>
        ))}
      </div>

      {/* Book Tab */}
      {tab === 'book' && (
        <div className="space-y-4">
          {success && (
            <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle className="w-4 h-4" /> Appointment booked! Redirecting...
            </div>
          )}

          {!selected ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {counselors.map(c => (
                <div key={c._id} className="card-hover">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-700 text-sm">{c.name}</h4>
                      <p className="text-blue-500 text-xs">{c.specialty}</p>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">{c.bio}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="badge bg-gray-100 text-gray-500">{c.experience}</span>
                        {c.languages.map(l => (
                          <span key={l} className="badge bg-blue-50 text-blue-500">{l}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelected(c)}
                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
                    Book with {c.name.split(' ')[1]} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {selected.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">{selected.name}</p>
                    <p className="text-blue-500 text-xs">{selected.specialty}</p>
                  </div>
                </div>
                <button onClick={() => { setSelected(null); setError(''); }} className="text-gray-300 hover:text-gray-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-2xl mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleBook} className="space-y-4">
                <div>
                  <label className="label flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Select Date</label>
                  <input type="date" min={today} value={date}
                    onChange={e => { setDate(e.target.value); setSlot(''); }}
                    className="input-field" required />
                </div>
                {date && (
                  <div>
                    <label className="label flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Available Slots</label>
                    <div className="flex flex-wrap gap-2">
                      {selected.availableSlots.map(s => (
                        <button key={s} type="button" onClick={() => setSlot(s)}
                          className={`px-4 py-2 rounded-2xl text-sm font-medium border transition-all duration-200 ${
                            slot === s ? 'bg-blue-500 text-white border-blue-500 shadow-soft' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                          }`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="label">Reason <span className="text-gray-400 font-normal">(optional)</span></label>
                  <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3}
                    placeholder="Briefly describe what you'd like to discuss..."
                    className="input-field resize-none" />
                </div>
                <button type="submit" disabled={loading || !date || !slot} className="btn-primary w-full">
                  {loading ? t('tele.booking') : t('tele.confirm')}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Appointments Tab */}
      {tab === 'appointments' && (
        <div className="space-y-5">
          {bookings.length === 0 ? (
            <div className="card text-center py-12">
              <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No appointments yet.</p>
              <p className="text-gray-300 text-xs mt-1">Book a session to get started.</p>
            </div>
          ) : (
            <>
              {upcomingBookings.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Upcoming</p>
                  <div className="space-y-3">
                    {upcomingBookings.map(b => (
                      <div key={b._id} className="card flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                            {b.counselorId?.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-700 text-sm">{b.counselorId?.name}</p>
                            <p className="text-blue-500 text-xs">{b.counselorId?.specialty}</p>
                            <p className="text-gray-400 text-xs mt-1">
                              {new Date(b.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} · {b.slot}
                            </p>
                            {b.reason && <p className="text-gray-300 text-xs mt-1 italic">"{b.reason}"</p>}
                          </div>
                        </div>
                        <button onClick={() => handleCancel(b._id)} className="text-red-300 hover:text-red-500 text-xs font-medium shrink-0 transition-colors">
                          {t('tele.cancel')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {pastBookings.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Past</p>
                  <div className="space-y-3">
                    {pastBookings.map(b => (
                      <div key={b._id} className="bg-gray-50 rounded-3xl p-4 flex items-start gap-3 opacity-60">
                        <div className="w-10 h-10 rounded-2xl bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm shrink-0">
                          {b.counselorId?.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-gray-600 text-sm">{b.counselorId?.name}</p>
                          <p className="text-gray-400 text-xs">
                            {new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {b.slot}
                          </p>
                          <span className={`badge mt-1 text-xs ${b.status === 'cancelled' ? 'bg-red-100 text-red-400' : 'bg-green-100 text-green-600'}`}>
                            {b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TeleCounseling;
