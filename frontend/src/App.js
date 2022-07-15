import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Stack from 'react-bootstrap/Stack';
import UserInfoProvider from './contexts/userInfoContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SingleCollection from './pages/SingleCollection';
import CreateCollectionPage from './pages/CreateCollectionPage';
import EditCollectionPage from './pages/EditCollectionPage';
import CreateItemPage from './pages/CreateItemPage';
import EditItemPage from './pages/EditItemPage';
import MyProfile from './pages/MyProfile';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Stack className="min-vh-100">
      <UserInfoProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="me" element={<MyProfile />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="collections">
            <Route path=":id" element={<SingleCollection />} />
          </Route>
          <Route path="collections/create" element={<CreateCollectionPage />} />
          <Route path="collections/edit">
            <Route path=":id" element={<EditCollectionPage />} />
          </Route>
          <Route path="items/create" element={<CreateItemPage />} />
          <Route path="items/edit">
            <Route path=":id" element={<EditItemPage />} />
          </Route>
        </Routes>
        <ToastContainer />
      </UserInfoProvider>
    </Stack>
  );
}

export default App;
