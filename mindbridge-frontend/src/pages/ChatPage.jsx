import Chat from '../components/Chat';
import { useLanguage } from '../context/LanguageContext';

const ChatPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-[calc(100dvh-8rem)]">
      <h1 className="page-title text-center">{t('nav.chat')}</h1>
      <Chat />
    </div>
  );
};

export default ChatPage;
