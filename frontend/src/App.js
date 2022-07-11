import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Stack from 'react-bootstrap/Stack';
import UserInfoProvider from './contexts/userInfoContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Stack className="min-vh-100">
      <UserInfoProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <ToastContainer />
      </UserInfoProvider>
    </Stack>
  );
}

export default App;
