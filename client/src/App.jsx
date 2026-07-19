import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SubmitQuestionPage from './pages/SubmitQuestionPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminPage from './pages/AdminPage';
import CollegesPage from './pages/CollegesPage';
import UniversitiesPage from './pages/UniversitiesPage';
import BrowsePage from './pages/BrowsePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import { SavedPapersProvider } from './context/SavedPapersContext';

function App() {
  return (
    <Router>
      <SavedPapersProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/manage/universities" element={<UniversitiesPage />} />
          <Route path="/manage/colleges" element={<CollegesPage />} />
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/submit" element={<ProtectedRoute><SubmitQuestionPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
        </Routes>
      </Layout>
      </SavedPapersProvider>
    </Router>
  );
}

export default App;