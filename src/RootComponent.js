import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import UsersManagement from './UsersManagement';
import Dashboard from './Dashboard';
import BookingTable from './BookingTable';
import InventoryManagement from './InventoryManagement';
import ClientManagement from './ClientManagement';
import OrderManagement from './OrderManagement';
import Login from './login'; 
import Sidebar from './Sidebar'; 
import { useAuth } from './AuthContext'; 

import loginImg from './Pictures_/thumbnail_NEW_LOGO_DESIGN_PNG.png'

function RootComponent() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      {/* Conditionally render Sidebar based on authentication status */}
      {isLoggedIn && (
      <header className=" bg-white h-20 shrink-0 border-4 border-b-orange-300 w-full fixed top-0 left-0 right-0 z-50">
        <div className="flex justify-center items-center h-full">
          <img className="object-contain h-16 w-26 px-20" src={loginImg}  />
        </div>
      </header>
      )}
      {isLoggedIn && <Sidebar />}

      <Routes>
        
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

        {/* Login route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes (require authentication) 
        <Route path="/users-management" element={isLoggedIn ? <UsersManagement /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/inventory" element={isLoggedIn ? <InventoryManagement /> : <Navigate to="/login" replace />} />
        <Route path="/client" element={isLoggedIn ? <ClientManagement /> : <Navigate to="/login" replace />} />
        <Route path="/order" element={isLoggedIn ? <OrderManagement /> : <Navigate to="/login" replace />} />
        <Route path="/booking-table" element={isLoggedIn ? <BookingTable /> : <Navigate to="/login" replace />} />
        <Route path="/InventoryItems" element={<InventoryItems/>} />*/}

        {/* Redirect to login page for any unmatched routes when not authenticated */}
        {!isLoggedIn && <Route path="*" element={<Navigate to="/login" replace />} />}
      </Routes>
    </Router>
  );
}

export default RootComponent;
