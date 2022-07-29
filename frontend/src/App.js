import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Stack from 'react-bootstrap/Stack';
import collectionService from './services/collectionService';
import UserInfoProvider from './contexts/userInfoContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import SingleCollection from './pages/SingleCollection';
import SingleItem from './pages/SingleItem';
import ManageCollection from './pages/ManageCollection';
import CreateItemPage from './pages/CreateItemPage';
import EditItemPage from './pages/EditItemPage';
import UserProfile from './pages/UserProfile';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Stack className="min-vh-100">
      <UserInfoProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="items/create" element={<CreateItemPage />} />
          <Route
            path="collections/create"
            element={
              <ManageCollection
                action="create"
                handleSubmit={collectionService.createCollection}
              />
            }
          />
          <Route path="users">
            <Route path=":id" element={<UserProfile />} />
          </Route>
          <Route path="collections">
            <Route path=":id" element={<SingleCollection />} />
          </Route>
          <Route path="items">
            <Route path=":id" element={<SingleItem />} />
          </Route>
          <Route path="collections/edit">
            <Route
              path=":id"
              element={
                <ManageCollection
                  action="update"
                  handleSubmit={collectionService.updateCollection}
                />
              }
            />
          </Route>
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
