import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingDrawer from './BookingDrawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import { hostaddress } from './App';

const BookingTable = () => {
  const [bookings, setBookings] = useState([]);
  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [dateSort, setDateSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilterOptions = () => {
    setShowFilters(!showFilters);
  };

  useEffect(() => {
    fetchBookings();
  }, [searchTerm, serviceTypeFilter, dateSort]); // Re-fetch when filters change

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${hostaddress}/bookings`);
      let data = response.data;

      // Apply search term filter
      if (searchTerm) {
        data = data.filter(booking =>
          booking.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.phone_number.includes(searchTerm)
        );
      }

      // Apply service type filter
      if (serviceTypeFilter) {
        data = data.filter(booking => booking.service_type === serviceTypeFilter);
      }

      // Sort by date
      if (dateSort === 'newest') {
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
      }

      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      alert('Failed to load bookings. Please try again later.');
    }
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setIsBookingDrawerOpen(true);
  };

  const handleDeleteBookings = async (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await axios.delete(`${hostaddress}/bookings/${bookingId}`);
        alert('Booking deleted successfully');
        fetchBookings();  // Refresh the list
      } catch (error) {
        console.error('Error deleting booking:', error);
        alert('Error deleting booking: ' + error.message);
      }
    }
  };

  const openDrawer = () => {
    setIsBookingDrawerOpen(true);
    setEditingBooking(null); // Reset editing booking when opening the drawer to add a new booking
  };

  const closeDrawer = () => {
    setIsBookingDrawerOpen(false);
    fetchBookings(); // Refresh bookings after a booking is added or edited
  };

  return (
    <div className="container mx-auto px-4 mt-5">
      <div className="flex justify-between items-center my-5">
        <h2 className="text-2xl font-bold">Booking List</h2>
        <button onClick={openDrawer} className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
          Add Booking
        </button>
      </div>

      <BookingDrawer
        isOpen={isBookingDrawerOpen}
        closeDrawer={closeDrawer}
        booking={editingBooking}
        fetchBookings={fetchBookings}
      />
      <hr className="h-px mt-3 mb-3 border-2 border-orange-500"></hr>

      <div className="relative flex items-center w-48 mt-6 ml-6 mb-4">
        <input
          type="text"
          placeholder="Search bookings..."
          className="border border-gray-400 size-8 text-sm p-2 pl-8 rounded-full w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          className="absolute left-3 text-gray-300 hover:text-gray-700 cursor-pointer"
          onClick={fetchBookings}
        />

        <div className="relative inline-block group">
          <button onClick={toggleFilterOptions} className="p-2">
            <FontAwesomeIcon icon={faFilter} style={{ color: '#a3a3a3' }} />
          </button>
          {showFilters && (
            <div className="absolute right-0 z-10 mt-2 bg-white border rounded shadow-lg w-64 p-4">
              <div className="p-4">
                <h4 className="font-bold">Filter by:</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Service Type</label>
                  <select
                    className="mt-1 block w-full p-2 border rounded"
                    value={serviceTypeFilter}
                    onChange={e => setServiceTypeFilter(e.target.value)}
                  >
                    <option value="">All Services</option>
                    <option value="Common Service">Common Service</option>
                    <option value="Inspection Service">Inspection Service</option>
                    <option value="PC assembling service">PC Assembling Service</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sort Date</label>
                  <button
                    onClick={() => setDateSort('newest')}
                    className={`mt-1 mr-2 p-2 ${dateSort === 'newest' ? 'bg-orange-400 text-white rounded-lg' : 'bg-gray-200 rounded-lg'}`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => setDateSort('oldest')}
                    className={`mt-1 p-2 ${dateSort === 'oldest' ? 'bg-orange-400 text-white rounded-lg' : 'bg-gray-200 rounded-lg'}`}
                  >
                    Oldest
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mx-5 overflow-x-auto shadow-md sm:rounded-lg max-h-[calc(105vh-200px)]">
        <table className="min-w-full text-sm text-center text-gray-500">
          <thead className="bg-orange-400 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold">Booking ID</th>
              <th className="py-3 px-4 uppercase font-semibold">First Name</th>
              <th className="py-3 px-4 uppercase font-semibold">Last Name</th>
              <th className="py-3 px-4 uppercase font-semibold">Email</th>
              <th className="py-3 px-4 uppercase font-semibold">Phone Number</th>
              <th className="py-3 px-4 uppercase font-semibold">Additional Message</th>
              <th className="py-3 px-4 uppercase font-semibold">Student Discount</th>
              <th className="py-3 px-4 uppercase font-semibold">Service Type</th>
              <th className="py-3 px-4 uppercase font-semibold">Date</th>
              <th className="py-3 px-4 uppercase font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {bookings.map(booking => (
              <tr key={booking.id} className="hover:bg-orange-100 border-b">
                <td className="py-3 px-4">{booking.id}</td>
                <td className="py-3 px-4">{booking.first_name}</td>
                <td className="py-3 px-4">{booking.last_name}</td>
                <td className="py-3 px-4">{booking.email}</td>
                <td className="py-3 px-4">{booking.phone_number}</td>
                <td className="py-3 px-4">{booking.additional_message}</td>
                <td className="py-3 px-4">{booking.student_discount}</td>
                <td className="py-3 px-4">{booking.service_type}</td>
                <td className="py-3 px-4">{new Date(booking.date).toLocaleDateString('en-GB')}</td>
                <td className="py-3 px-4">
                  <FontAwesomeIcon icon={faEdit} className="ml-2 text-green-500 hover:text-green-700 cursor-pointer" onClick={() => handleEdit(booking)} />
                  <FontAwesomeIcon icon={faTrash} className="ml-2 text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDeleteBookings(booking.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingTable;