import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Stack from 'react-bootstrap/Stack';
import UserInfoProvider from './contexts/userInfoContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateCollectionPage from './pages/CreateCollectionPage';
import CreateItemPage from './pages/CreateItemPage';
import MyProfile from './pages/MyProfile';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Stack className="min-vh-100">
      <UserInfoProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/me" element={<MyProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/collections/create" element={<CreateCollectionPage />} />
          <Route path="/items/create" element={<CreateItemPage />} />
        </Routes>
        <ToastContainer />
      </UserInfoProvider>
    </Stack>
  );
}

export default App;
