import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Signup from './pages/Signup/Signup';
import CreatePost from './pages/posts/CreatePost';
import EditPost from './pages/posts/EditPost';
import ViewPost from './pages/posts/ViewPost';
import ProtectedRoute from './routes/ProtectedRoute';
import ProtectedLayout from './components/Layout/ProtectedLayout';
import { AuthProvider } from './context/AuthContext';
import UserSettings from './pages/Settings/User/UserSettings';


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/posts/:slug" element={<ViewPost />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/posts/:postId" element={<EditPost />} />
              <Route path="/create-post" element={<CreatePost />} />
              <Route path="/settings" element={<UserSettings />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
