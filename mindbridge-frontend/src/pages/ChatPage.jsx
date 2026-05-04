import Chat from '../components/Chat';
import { useLanguage } from '../context/LanguageContext';

const ChatPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-[calc(100dvh-8rem)]">
      <h1 className="text-3xl font-bold mb-6 text-center">{t('nav.chat')}</h1>
      <Chat />
    </div>
  );
};

export default ChatPage;
