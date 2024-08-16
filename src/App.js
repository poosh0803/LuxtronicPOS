/*import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import UsersManagement from './UsersManagement';
import Dashboard from './Dashboard';
import BookingTable from './BookingTable';
import InventoryManagement from './InventoryManagement';
import ClientManagement from './ClientManagement';
import OrderManagement from './OrderManagement';
import BookingDrawer from './BookingDrawer';
import PrivateRoute from './privateroute'; // Assuming you have implemented PrivateRoute
import Login from './login'; // Import your Login component
import { useAuth } from './AuthContext'; // Assuming you have implemented useAuth for authentication

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="h-screen w-screen bg-white flex flex-row">
      {isLoggedIn ? (
        <AuthenticatedLayout />
      ) : (
        <UnauthenticatedLayout />
      )}
    </div>
  );
}

const AuthenticatedLayout = () => {
  return (
    <>
    <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Routes>
          <PrivateRoute path="/users-management" element={<UsersManagement />} />
          <PrivateRoute path="/dashboard" element={<Dashboard />} />
          <PrivateRoute path="/inventory" element={<InventoryManagement />} />
          <PrivateRoute path="/client" element={<ClientManagement />} />
          <PrivateRoute path="/order" element={<OrderManagement />} />
          <PrivateRoute path="/booking-table" element={<BookingTable />} />
          <Route path="/*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
      <BookingDrawer />
    </>
  );
};

const UnauthenticatedLayout = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default App;*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Login from './login'; 

const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        <header className="bg-white h-20 shrink-0 border-4 border-b-orange-300 w-full">
          <div className="flex justify-center items-center h-full">
            <img className="object-contain h-16 w-26 px-20" src="/images/thumbnail_NEW_LOGO_DESIGN_PNG.png" alt="Logo" />
          </div>
        </header>
        <div className="flex flex-row flex-1 overflow-hidden">
          <Sidebar />
        </div>
      </div>
    </Router>
  );
};

export default App;

const hostaddress = 'http://192.168.68.222:8000';
// const hostaddress = 'http://localhost:8000';
// const hostaddress = 'http://dkpoosh.ddns.net:8000';
export {hostaddress};