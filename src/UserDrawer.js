import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { hostaddress } from './App';

const UserDrawer = ({ isOpen, closeDrawer, selectedUser }) => {
  const [formData, setFormData] = useState({
    UserID: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    password: '',
    position: ''
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        UserID: selectedUser.userID,
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        dateOfBirth: selectedUser.dateOfBirth,
        phoneNumber: selectedUser.phoneNumber,
        email: selectedUser.email,
        password: selectedUser.password,
        position: selectedUser.position
      });
    } else {
      setFormData({
        UserID: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        password: '',
        position: ''
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        // Update existing user (PUT request)
        await axios.put(`${hostaddress}/users/${selectedUser.userID}`, formData);
        console.log('User updated successfully');
      } else {
        // Create new user (POST request)
        await axios.post(`${hostaddress}/users`, formData);
        console.log('User added successfully');
      }
      setFormData({
        UserID: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phoneNumber: '',
        email: '',
        password: '',
        position: ''
      });
      closeDrawer(); // Close the drawer after successful submission
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg z-50 p-4">
      <h2 className="text-lg font-semibold">{selectedUser ? 'Edit User' : 'Add New User'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <label className="block mt-4">
          <span className="text-gray-700">User ID</span>
          <input
            type="text"
            name="UserID"
            value={formData.UserID}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter User ID"
            disabled={!!selectedUser} // Disable UserID field for editing
          />
        </label> 
        <label className="block mt-4">
            <span className="text-gray-700">First Name</span>
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter First Name"
                />
        </label>
        <label className="block mt-4">
            <span className="text-gray-700">Last Name</span>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter Last Name"
                />
        </label>
        <label className="block mt-4">
            <span className="text-gray-700">Date of Birth</span>
                <input type="date"  // Set the type attribute to "date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter Date of  Birth"
            />
        </label>
        <label className="block mt-4">
            <span className="text-gray-700">Phone Number</span>
                <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter Phone Number"
                />
        </label>
        <label className="block mt-4">
            <span className="text-gray-700">Email</span>
                <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter Email Address"
                />
        </label>
        <label className="block mt-4">
            <span className="text-gray-700">Password</span>
                <input
                    type="text"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter Phone Number"
                />
        </label>
        <label className="block mt-4">
            <span className="text-gray-700">Position</span>
                <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter the Position"
                />
        </label>
        <div className="mt-6 flex justify-between">
          <button type="submit" className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
            {selectedUser ? 'Save Changes' : 'Save User'}
          </button>
          <button
            type="button"
            onClick={closeDrawer}
            className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDrawer;