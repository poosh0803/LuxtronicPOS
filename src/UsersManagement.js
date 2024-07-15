import React, { useState, useEffect } from 'react';
import UserDrawer from './UserDrawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrash, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import DropdownMenu from './DropdownMenu'; // Assuming DropdownMenu is already implemented
import axios from 'axios';
import { hostaddress } from './App';

function UsersManagement() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [resettingUserId, setResettingUserId] = useState(null); // Track user ID for password reset
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const openDrawer = (user) => {
    setSelectedUser(user); // Set the selected user for editing
    setIsDrawerOpen(true); // Open the drawer
  };

  const closeDrawer = () => {
    setSelectedUser(null); // Reset selected user when closing drawer
    setIsDrawerOpen(false);
    fetchUsers(); 
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${hostaddress}/users/`);
      setUsers(response.data); // Update state with fetched users
      setError(null); // Clear any previous errors



      const filteredUser = response.data.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.dateOfBirth.includes(searchTerm)||
        user.phoneNumber.includes(searchTerm)||
        user.email.toLowerCase().includes(searchTerm)||
        user.password.toLowerCase().includes(searchTerm)||
        user.position.toLowerCase().includes(searchTerm)
      );

      setUsers(filteredUser);


    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.'); // Set error message
    }
  };

  useEffect(() => {
    fetchUsers(); // Fetch users when component mounts
  }, []); // Empty dependency array ensures effect runs once

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`${hostaddress}/users/${userId}`);
      setUsers(users.filter(user => user.userID !== userId)); // Update users list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user. Please try again.');
    }
  };

  const resetPassword = async (userId) => {
    try {
      // Validate newPassword and confirmNewPassword before proceeding
      if (newPassword !== confirmNewPassword) {
        setError("New password and confirm new password don't match.");
        return;
      }

      // Make API request to reset user password
      await axios.put(`${hostaddress}/users/${userId}/reset-password`, {
        newPassword: newPassword
      });

      console.log('Password reset successfully.');

      // Optionally fetch updated users after password reset
      fetchUsers();

      // Close the password change dialog and reset state
      setIsChangePasswordDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error('Error resetting password:', error);
      setError('Failed to reset password. Please try again.');
    }
  };

  const handlePasswordChangeConfirmation = () => {
    if (!selectedUser) {
      console.error('No user selected.');
      setError('No user selected.');
      return;
    }

    // Call resetPassword with the selected user's ID
    resetPassword(selectedUser.userID);
  };

  const closeChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
    setSelectedUser(null); // Reset selected user
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
};

const openChangePasswordDialog = (user) => {
  setSelectedUser(user); // Set the selected user for password change
  setIsChangePasswordDialogOpen(true); // Open the password change dialog
};

  



  return (

    
    <div className="container mx-auto px-4 mt-5">

<div className='flex justify-between items-center my-5'>
      
      <h2 className="ml-5 text-2xl font-bold">User Management</h2>

    <button onClick={() => openDrawer(null)} className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
        Add New User
      </button>

</div>

<hr class="h-px mt-3 mb-3 border-2 border-orange-500"></hr>
      <div className="relative flex items-center w-48 mt-6 ml-6 mb-4">
  <input
    type="text"
    placeholder="Search users..."
    className="border border-gray-400 size-8 text-sm p-2 pl-10 rounded-full w-full"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <FontAwesomeIcon
    icon={faMagnifyingGlass}
    className="absolute left-3 text-gray-300 hover:text-gray-700 cursor-pointer"
    onClick={fetchUsers}
  />

    




      
      
      </div>
      
      <UserDrawer isOpen={isDrawerOpen} closeDrawer={closeDrawer} selectedUser={selectedUser} />
      {error && <p className="text-red-500">{error}</p>}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="bg-orange-400 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold">User ID</th>
              <th className="py-3 px-4 uppercase font-semibold">First Name</th>
              <th className="py-3 px-4 uppercase font-semibold">Last Name</th>
              <th className="py-3 px-4 uppercase font-semibold">Date of Birth</th>
              <th className="py-3 px-4 uppercase font-semibold">Phone Number</th>
              <th className="py-3 px-4 uppercase font-semibold">Email</th>
              <th className="py-3 px-4 uppercase font-semibold">Password</th>
              <th className="py-3 px-4 uppercase font-semibold">Position</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => (
              <tr key={user.userID} className="bg-white border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-semibold">{user.userID}</td>
                <td className="py-3 px-4">{user.firstName}</td>
                <td className="py-3 px-4">{user.lastName}</td>
                <td className="py-3 px-4">{new Date(user.dateOfBirth).toLocaleDateString('en-GB')}</td> 
                <td className="py-3 px-4">{user.phoneNumber}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">************</td>
                <td className="py-3 px-4">{user.position}</td>
                <td className="py-3 px-4">
                  {resettingUserId === user.userID ? (
                    <div className="flex items-center">
                      <input
                        type="password"
                        placeholder="New Password"
                        className="border p-1 mr-2"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button onClick={() => setResettingUserId(null)} className="bg-gray-300 hover:bg-gray-400 text-black py-1 px-2 rounded">
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <DropdownMenu
                      trigger={
                        <FontAwesomeIcon
                          icon={faEllipsisV}
                          className="text-gray-600 cursor-pointer"
                        />
                      }
                    >
                      <button onClick={() => openChangePasswordDialog(user)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                        Change Password
                      </button>
                    </DropdownMenu>
                  )}
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="text-green-500 cursor-pointer ml-2"
                    onClick={() => openDrawer(user)} // Pass the selected user to openDrawer function
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="text-red-500 cursor-pointer ml-2"
                    onClick={() => deleteUser(user.userID)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      

      {/* Password Change Dialog */}
      {isChangePasswordDialogOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex justify-center items-center">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div className="relative z-50 bg-white rounded-lg p-6 max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="newPassword"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              onClick={handlePasswordChangeConfirmation}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirm Password Change
            </button>
            <button
              onClick={closeChangePasswordDialog}
              className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded ml-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManagement;