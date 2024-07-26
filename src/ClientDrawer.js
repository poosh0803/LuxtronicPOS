import React, { useState, useEffect } from "react";
import { hostaddress } from "./App";

const ClientDrawer = ({
  isOpen,
  closeDrawer,
  saveClient,
  client,
  fetchClients,
}) => {
  // State for client data
  const [clientData, setClientData] = useState({
    companyName: "",
    clientName: "",
    ABN: "",
    telephone: "",
    emailAddress: "",
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Effect to load client data into state when editing
  useEffect(() => {
    if (client) {
      setClientData({
        companyName: client.company_name,
        clientName: client.client_name,
        ABN: client.abn,
        telephone: client.telephone,
        emailAddress: client.email,
      });
    } else {
      setClientData({
        companyName: "",
        clientName: "",
        ABN: "",
        telephone: "",
        emailAddress: "",
      });
    }
  }, [client]);

  // Handle form field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setClientData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    // Validation logic, adding errors to newErrors object if any fields are invalid
    if (!clientData.companyName) {
      newErrors.companyName = "Company name is required.";
    }
    if (!clientData.clientName) {
      newErrors.clientName = "Client name is required.";
    }
    if (!clientData.ABN) {
      newErrors.ABN = "ABN is required.";
    }
    if (!clientData.telephone) {
      newErrors.telephone = "Telephone number is required.";
    }
    if (!clientData.emailAddress) {
      newErrors.emailAddress = "Email address is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.error("Validation failed:", errors);
      return; // Stop the submission if the form is invalid
    }

    const method = client ? "PUT" : "POST"; // Determine method based on if editing or creating new
    const url = client
      ? `${hostaddress}/client/${client.client_id}`
      : `${hostaddress}/client`;

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clientData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save client data");
        }
        return response.json();
      })
      .then(() => {
        alert(`Client saved successfully! ${clientData.client_id}`);
        closeDrawer();
        fetchClients(); // Refresh the list
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to save client: " + error.message);
      });
  };

  // Only render the drawer if it is open
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg z-50 p-4">
      <h2 className="text-lg font-semibold">
        {client ? "Edit Client" : "Add New Client"}
      </h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(clientData).map(([key, value]) => (
          <label className="block mt-4" key={key}>
            <span className="text-gray-700">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </span>
            <input
              type={key === "emailAddress" ? "email" : "text"}
              name={key}
              value={value}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder={`Enter ${key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}`}
            />
            {errors[key] && (
              <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
            )}
          </label>
        ))}
        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Client
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

export default ClientDrawer;
