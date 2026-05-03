import { Sparkles, Heart } from 'lucide-react';

const quotes = [
  'You are doing better than you think.',
  'Small steps every day can create big change.',
  'Your feelings are valid, and you are not alone.',
  'Take a deep breath. This moment will pass.',
  'Healing is not linear, and that is okay.'
];

const WelcomePage = () => {
  const quote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card max-w-2xl w-full text-center animate-fade-in">
        <div className="w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center mb-5">
          <Heart className="w-7 h-7 text-white" />
        </div>
        <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">MindBridge Daily Positivity</p>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-snug">
          "{quote}"
        </h1>
        <p className="text-gray-500 mt-4">
          Pick any option from the left menu to continue your wellness journey.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm">
          <Sparkles className="w-4 h-4" />
          Stay kind to yourself today
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
