import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import WelcomePage from './pages/WelcomePage';
import ChatPage from './pages/ChatPage';
import MoodPage from './pages/MoodPage';
import RecommendationsPage from './pages/RecommendationsPage';
import ResourcesPage from './pages/ResourcesPage';
import TeleCounselingPage from './pages/TeleCounselingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Sidebar onLogout={handleLogout} />
        <div className="md:ml-64 pb-20 md:pb-0">
          <div className="flex justify-end px-4 md:px-6 pt-4 md:pt-5 max-w-5xl mx-auto">
            <LanguageSwitcher compact />
          </div>
          <main className="p-4 md:p-6 max-w-5xl mx-auto">
            <Routes>
              <Route path="/" element={<WelcomePage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/mood" element={<MoodPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/tele-counseling" element={<TeleCounselingPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
        <BottomNav onLogout={handleLogout} />
      </div>
    </Router>
  );
}

export default App;
