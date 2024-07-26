import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { hostaddress } from "./App";

const BookingDrawer = ({
  isOpen,
  closeDrawer,
  booking,
  fetchBookings,
  saveBooking,
}) => {
  const [bookingData, setBookingData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    additionalMessage: "",
    studentDiscount: "No",
    serviceType: "Common Service",
    bookingDate: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (booking) {
      setBookingData({
        firstName: booking.first_name,
        lastName: booking.last_name,
        email: booking.email,
        phoneNumber: booking.phone_number,
        additionalMessage: booking.additional_message,
        studentDiscount: booking.student_discount,
        serviceType: booking.service_type,
        bookingDate: booking.date,
      });
    } else {
      setBookingData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        additionalMessage: "",
        studentDiscount: "No",
        serviceType: "Common Service",
        bookingDate: "",
      });
    }
  }, [booking]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBookingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!bookingData.firstName) {
      newErrors.firstName = "First name is required.";
    }
    if (!bookingData.lastName) {
      newErrors.lastName = "Last name is required.";
    }
    if (!bookingData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(bookingData.email)) {
      newErrors.email = "Email address is invalid.";
    }
    if (!bookingData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    }
    if (!bookingData.bookingDate) {
      newErrors.bookingDate = "Date is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const method = booking ? "PUT" : "POST";
      const url = booking
        ? `${hostaddress}/bookings/${booking.id}`
        : `${hostaddress}/bookings`;

      fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to save booking");
          }
          return response.json();
        })
        .then(() => {
          alert("Booking saved successfully!");
          closeDrawer();
          fetchBookings();
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Failed to save booking: " + error.message);
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 top-0 w-96 bg-white p-4 transition-transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <h2 className="text-xl font-bold mb-4">
        {booking ? "Edit Booking" : "Add New Booking"}
      </h2>
      <form onSubmit={handleSaveClick}>
        {Object.entries(bookingData).map(([key, value]) => (
          <div key={key}>
            <label className="block mb-2 capitalize">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
              {key === "studentDiscount" || key === "serviceType" ? (
                <select
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                >
                  {key === "studentDiscount"
                    ? ["Yes", "No"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))
                    : [
                        "Common Service",
                        "Inspection Service",
                        "PC assembling service",
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                </select>
              ) : (
                <input
                  type={key === "bookingDate" ? "date" : "text"}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                  placeholder={`Enter ${key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}`}
                />
              )}
            </label>
            {errors[key] && (
              <p className="text-red-500 text-xs">{errors[key]}</p>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Save
        </button>
        <button
          type="button"
          onClick={closeDrawer}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-2 mt-4"
        >
          Close
        </button>
      </form>
    </div>
  );
};

export default BookingDrawer;
