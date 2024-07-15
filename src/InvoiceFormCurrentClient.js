import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import generatePDF from './GeneratePDF';
import { useNavigate } from 'react-router-dom';
import { hostaddress } from './App';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const InvoiceFormCurrentClient = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [formValues, setFormValues] = useState({
    invoiceNo: '',
    companyName: '',
    name: '',
    telephone: '',
    email: '',
    amount: '',
    dueDate: ''
  });

  useEffect(() => {
    fetch(`${hostaddress}/client`)
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error fetching clients:', error));
  }, []);

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    const client = clients.find(c => c.client_id.toString() === clientId);
    if (client) {
      setSelectedClient(clientId);
      setFormValues({
        ...formValues,
        companyName: client.company_name,
        name: client.client_name,
        telephone: client.telephone,
        email: client.email
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Invoice details:', formValues);
    generatePDF(formValues);  // Generate PDF with the form values
  };

  const goBack = () => {
    navigate('/InvoiceForm');  // Navigate back to the InvoiceForm
  };

  return (
    <div className="container mx-auto px-4 mt-20">
      <h2 className="text-2xl font-bold mb-4">Create Invoice for Existing Client</h2>
     


      <select onChange={handleClientChange} value={selectedClient} className="mb-4">
        <option value="">Select Campany Name & Client Name</option>
        {clients.map(client => (
          <option key={client.client_id} value={client.client_id}>
            {client.company_name} - {client.client_name}
          </option>
        ))}
      </select>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Render each form field with onChange to handle inputs */}
        {Object.entries(formValues).map(([key, value]) => (
          key !== 'invoiceNo' && <div className="mb-4" key={key}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              id={key}
              name={key}
              type="text"
              value={value}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        ))}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>


          <button
        onClick={goBack}
        className=" bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Back 
      </button>
        
        </div>

      </form>
    
    </div>
  );
};

export default InvoiceFormCurrentClient;
