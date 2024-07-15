import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import UsersManagement from './UsersManagement';
import Dashboard from './Dashboard';
import BookingTable from './BookingTable';
import InventoryManagement from './InventoryManagement';
import Login from './login';
import App from './App';

import InventoryDrawer from './InventoryDrawer';
import ClientManagement from './ClientManagement';
import OrderManagement from './OrderManagement';
import BookingDrawer from './BookingDrawer';
import InventoryItems from './InventoryItems';
import InvoiceForm from './InvoiceForm';
import InvoiceFormCurrentClient from './InvoiceFormCurrentClient';
import dashboardImg from './Pictures_/9055226_bxs_dashboard_icon.svg';
import calendarImg from './Pictures_/8665078_calendar_days_icon.svg';
import userImg from './Pictures_/309035_user_account_human_person_icon.svg';
import clientImg from './Pictures_/211793_people_icon.svg';
import settingImg from './Pictures_/1564529_mechanism_options_settings_configuration_setting_icon.svg';
import inventoryImg from './Pictures_/1167996_list_check_checklist_dots_menu_icon.svg';
import orderImg from './Pictures_/2639867_bag_money_icon.svg';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAuth } from './AuthContext'; // Importing useAuth hook
import profile from './Pictures_/profile.jpg';



function Sidebar() {
  
  const [activeTab, setActiveTab] = useState('booking');

  const navigate = useNavigate();
  
  const { logout, user } = useAuth();

  const handleLogout = () => {
  
    navigate('/login');  // Assuming '/login' is your route for the login page
  };

  

  const tabs = [
    {
      label: 'Dashboard',
      slug: '/dashboard',
      icon: dashboardImg
      
    },
    {
      label: 'Inventory Management',
      slug: '/inventory',
      icon: inventoryImg
      
    },
    { label:
      'Order Management',
      slug: '/order',
      icon: orderImg
    },
    {
      label: 'Client Management',
      slug: '/client',
      icon: clientImg
    },
    {
      label: 'Booking Management',
      slug: '/booking-table',
      icon: calendarImg
    },
    {
      label: 'Users',
      slug: '/users-management',
      icon: userImg
    },
  
    
  ];

  

  return (
    <div className="h-screen w-screen bg-white flex pt-20">

<style>
  {`
    .icon {
      filter: brightness(0) saturate(100%) invert(92%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(105%); /* Adjusted for white-ish appearance */
    }
    .icon-active {
      filter: invert(33%) sepia(95%) saturate(6350%) hue-rotate(217deg) brightness(100%) contrast(103%);
  `}
</style>


<div className="h-full bg-gradient-to-b from-orange-500 to-orange-300 w-72 px-3 py-5 border-r-4 border-r-orange-300">


<div >
       <div className="flex flex-row gap-5 ">
          <div> <img class="object-contain h-12 w-26" src={profile} alt="Logo" /></div>
          <div className="flex flex-col ">
            <span className="text-gray-600 text-sm">ADMIN</span>
            <span className="text-sm text-white underline underline-offset-4">Stanley Huang</span>
          </div>
        </div>
        {/**creates white seperator line */}
        <hr class="h-px mt-3 mb-3 border-2 border-white"></hr>
        <div className="mt-10 flex flex-col gap-3">
          
          {tabs.map((tab, index) => (
            <Link
              key={index}
              to={tab.slug}
              className={`flex items-center p-3 gap-2 w-full rounded-md ${activeTab === tab.slug ? 'bg-white font-semibold text-blue-500' : 'font-sans text-neutral-50 '}`}
              onClick={() => {
                setActiveTab(tab.slug);
                navigate(tab.slug);  
              }}

              
            >
               <img src={tab.icon} alt={`${tab.label} icon`} className={`h-6 w-6 ${activeTab === tab.slug ? 'icon-active' : 'icon'}`} />
              {tab.label}
            </Link>
          ))}

<button
          className="flex items-center p-3 gap-2 w-full rounded-md text-neutral-50 hover:bg-white hover:text-blue-500"
          onClick={() => logout()}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="h-6 w-6"  />
          Logout
        </button>
      
        </div>

        </div>

   

       
        
        
      </div>

      

      
<div className="flex-1 overflow-auto">
      <Routes>
        <Route path="/users-management" element={<UsersManagement />} />
        <Route path="/InventoryItems/:itemId" element={<InventoryItems />} />
        <Route path= "/inventory/${itemId}/products/${itemDetails.products[index].serial_number" element={<InventoryItems />}></Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryManagement />} />
        <Route path="/client" element={<ClientManagement />} />
        <Route path="/order" element={<OrderManagement />} />
        <Route path="/booking-table" element={<BookingTable  />} />
        <Route path= "/InvoiceForm" element={<InvoiceForm />}></Route>
        <Route path="/InvoiceFormCurrentClient" element={<InvoiceFormCurrentClient />} />
        <Route path="/login" element={<Login />} />
        
      </Routes>

      </div>
    </div>
  );
}

export default Sidebar;