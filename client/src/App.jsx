import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SubmitQuestionPage from './pages/SubmitQuestionPage';
import QuestionDetailPage from './pages/QuestionDetailPage';
import ProtectedRoute from './components/ProtectedRoute';
import CollegesPage from './pages/CollegesPage';
import UniversitiesPage from './pages/UniversitiesPage';


function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/manage/universities" element={<UniversitiesPage />} />
          <Route path="/manage/colleges" element={<CollegesPage />} />
          <Route path="/questions/:id" element={<QuestionDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/submit" element={<ProtectedRoute><SubmitQuestionPage /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;