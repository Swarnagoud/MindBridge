import { X, Phone, Heart } from 'lucide-react';

const CrisisPopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
    <div className="bg-white rounded-3xl shadow-soft-lg max-w-md w-full p-6 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800">You matter. Help is here.</h2>
            <p className="text-xs text-gray-400">Immediate support available 24/7</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-5 leading-relaxed">
        We're here for you. Please reach out to one of these helplines — trained professionals are ready to listen.
      </p>

      <div className="space-y-3 mb-5">
        {[
          { name: 'Tele MANAS', numbers: ['14416', '1-800-891-4416'], desc: '24/7 · Multi-language' },
          { name: 'Vandrevala Foundation', numbers: ['9999666555'], desc: 'Mental health helpline' },
          { name: 'iCALL', numbers: ['9152987821'], desc: 'Psychosocial support' },
        ].map((h, i) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-700 text-sm">{h.name}</p>
              <p className="text-xs text-gray-400">{h.desc}</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              {h.numbers.map(n => (
                <a key={n} href={`tel:${n}`}
                  className="flex items-center gap-1.5 bg-green-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-green-600 transition-colors">
                  <Phone className="w-3 h-3" /> {n}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-gray-400">
        Remember — you are not alone. Help is always available. 💙
      </p>
    </div>
  </div>
);

export default CrisisPopup;
