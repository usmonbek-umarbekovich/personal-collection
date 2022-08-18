import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Stack from 'react-bootstrap/Stack';
import collectionService from './services/collectionService';
import itemService from './services/itemService';
import UserInfoProvider from './contexts/userInfoContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import SingleCollection from './pages/SingleCollection';
import SingleItem from './pages/SingleItem';
import ItemsByTag from './pages/ItemsByTag';
import ManageCollection from './pages/ManageCollection';
import ManageItem from './pages/ManageItem';
import UserProfile from './pages/UserProfile';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Stack className="min-vh-100" style={{ marginTop: 'var(--nav-height)' }}>
      <UserInfoProvider>
        <Navigation />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="search" element={<Search />} />
          <Route path="tags" element={<ItemsByTag />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="items/create"
            element={
              <ManageItem
                action="create"
                handleSubmit={itemService.createItem}
              />
            }
          />
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
            <Route
              path=":id"
              element={
                <ManageItem
                  action="update"
                  handleSubmit={itemService.updateItem}
                />
              }
            />
          </Route>
        </Routes>
        <ToastContainer />
      </UserInfoProvider>
    </Stack>
  );
}

export default App;
