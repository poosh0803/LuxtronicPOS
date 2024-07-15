import React, { useState, useEffect } from 'react';
import generatePDF from './GeneratePDF';
import generateQuote from './GenerateQuote';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { hostaddress } from './App';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const InvoiceForm = ({ orderType }) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    invoiceNo: '',
    companyName: '',
    clientName: '',
    telephone: '',
    email: '',
    dueDate: '',
    discount: ''
  });
  const [clients, setClients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get(`${hostaddress}/client`);
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        alert('Failed to fetch clients');
      }
    };

    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${hostaddress}/inventory`);
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        alert('Failed to fetch inventory');
      }
    };

    fetchClients();
    fetchInventory();
  }, []);

  const handleClientChange = (e) => {
    const clientId = e.target.value;
    const client = clients.find(c => c.client_id.toString() === clientId);
    if (client) {
      setSelectedClient(clientId);
      setFormValues({
        ...formValues,
        companyName: client.company_name,
        clientName: client.client_name,
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

  const updateProductStatus = async (selectedSerialNumbers) => {
    try {
      const response = await axios.put(`${hostaddress}/update-product-status`, {
        serialNumbers: selectedSerialNumbers,
        status: 'Purchased' // Set status to 'Purchased'

      });
      console.log('Status update response:', response.data.message);
    } catch (error) {
      console.error('Failed to update product status:', error);
      alert('Failed to update product status');
    }
  };

  const handleSubmit = async () => {
    if (!selectedOption) {
      alert('Please select an option.');
      return;
    }
  
    if (selectedOption === 'invoice') {
      const selectedCartItem = cart.find(item => item.selectedSerialNumbers.length > 0);
      if (!selectedCartItem) {
        alert('No serial number selected for purchasing.');
        return;
      }
  
      const selectedSerialNumbers = selectedCartItem.selectedSerialNumbers;
  
      try {
        await updateProductStatus(selectedSerialNumbers);
        console.log('Product status updated successfully.');
      } catch (error) {
        console.error('Failed to update product status:', error);
        alert('Failed to update product status');
        return;
      }
    }
  
    console.log(`${selectedOption} details:`, formValues);
  
    const orderData = {
      ...formValues,
      paymentMethod: selectedOption,
      totalAmount: calculateTotal(),
      cart
    };
  
    try {
      const response = await axios.post(`${hostaddress}/orders`, orderData);
      console.log('Order created successfully:', response.data);
      alert('Order created successfully');
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order');
    }
  
    console.log(`${selectedOption} details:`, formValues);
  
    if (selectedOption === 'invoice') {
      generatePDF(formValues, selectedOption, cart, calculateTotal());
    } else if (selectedOption === 'quote') {
      generateQuote(formValues, selectedOption, cart, calculateTotal());
    }
  };
  const addToCart = async (item) => {
    try {
      const response = await axios.get(`${hostaddress}/inventory/${item.inventory_id}/products`);
      const products = response.data;
  
      let cartItem = {
        ...item,
        quantity: 1,
        products: products,
        selectedSerialNumbers: [] // Initialize with an empty array
      };
  
      if (!products.length) {
        alert('This item is out of stock.');
        return;
      }
  
      setCart([...cart, cartItem]);
    } catch (error) {
      console.error('Error fetching product details:', error);
      alert('Failed to fetch product details');
    }
  };

  const updateQuantity = (index, quantity) => {
    const newCart = [...cart];
    newCart[index].quantity = quantity;
    setCart(newCart);
  };

  const calculateTotal = () => {
    const discount = parseFloat(formValues.discount) || 0;
    const total = cart.reduce((total, item) => total + item.retail_price * item.quantity, 0);
    return (total - discount).toFixed(2);
  };

  const total = calculateTotal();


  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const goBack = () => {
    navigate('/order');
  };

  const updateSerialNumber = (index, serialNumber) => {
    const newCart = [...cart];
    newCart[index].selectedSerialNumbers = [serialNumber]; // Set selected serial number
    setCart(newCart);
  };

  return (
    <div className="container mx-auto px-4 mt-16 overflow-y-auto max-h-[calc(105vh-200px)]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-4 md:mb-0">Create Invoice or Quote</h2>
        <div className="flex">
          <div className="relative mr-4">
            <select
              className="block appearance-none bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <option value="">Select Option</option>
              <option value="invoice">Create Invoice</option>
              <option value="quote">Create Quote</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 11.293a1 1 0 011.414 0L10 12.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414zM7 7a1 1 0 012 0v4a1 1 0 11-2 0V7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <button
            onClick={() => handleSubmit(selectedOption)}
            className="bg-orange-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
            disabled={!selectedOption || (selectedOption === 'invoice' && cart.every(item => !item.selectedSerialNumbers))}
          >
            Generate {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
          </button>
          <button
            onClick={goBack}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Back
          </button>
        </div>
      </div>

      <form className="bg-white shadow-md rounded px-8 pt-0 pb-8 mb-4">
      
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="clientSelect">
          Select Client
        </label>
        <select
          className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          id="clientSelect"
          value={selectedClient}
          onChange={handleClientChange}
        >
          <option value="">Select a client</option>
          {clients.map(client => (
            <option key={client.client_id} value={client.client_id}>
              {client.client_name}
            </option>
          ))}
        
        </select>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="relative mb-4 pt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="invoiceNo">
              Invoice No
          </label>
    <input
      type="text"
      name="invoiceNo"
      id="invoiceNo"
      value={formValues.invoiceNo}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded"
    />
  </div>
  <div className="relative mb-4 pt-4 ">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyName">
      Company Name
    </label>
    <input
      type="text"
      name="companyName"
      id="companyName"
      value={formValues.companyName}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded"
    />
  </div>
  <div className="relative mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
      Name
    </label>
    <input
      type="text"
      name="name"
      id="name"
      value={formValues.clientName}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded"
    />
  </div>
  <div className="relative mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="telephone">
      Telephone
    </label>
    <input
      type="text"
      name="telephone"
      id="telephone"
      value={formValues.telephone}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded"
    />
  </div>
  <div className="relative mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
      Email
    </label>
    <input
      type="email"
      name="email"
      id="email"
      value={formValues.email}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded"
    />
  </div>
  <div className="relative mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
      Due Date
    </label>
    <input
      type="date"
      name="dueDate"
      id="dueDate"
      value={formValues.dueDate}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded"
    />
  </div>
  <div className="relative mb-4">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="discount">
      Discount
    </label>
    <input
      type="number"
      name="discount"
      id="discount"
      value={formValues.discount}
      onChange={handleChange}
      className="w-full px-3 py-2 border rounded"
    />
  </div>
</div>
      </form>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Inventory</h2>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search Inventory"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 11.293a1 1 0 011.414 0L10 12.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414zM7 7a1 1 0 012 0v4a1 1 0 11-2 0V7z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-y-auto max-h-88">
          {inventory
            .filter((item) =>
              item.item.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((item) => (
              <div key={item.inventory_id} className="border p-4 rounded shadow-md">
                <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover mb-2" />
                <p className="text-lg font-bold">{item.item}</p>
                <p>{item.description}</p>
                <p>Sales Price: ${item.retail_price}</p>
                {item.status == 'In Stock' ? (
                      <span className="text-sm text-red-600">Out of Stock</span>
                  ) : (
                  <button onClick={() => addToCart(item)} className="mt-2 bg-orange-400 text-white py-1 px-2 rounded">
                  Add to Cart
                  </button>
  )}
                
                
              </div>
            ))}
        </div>
      </div>

      <div className="mb-8">
  <h3 className="text-2xl font-bold mb-4">Cart</h3>
  {cart.length === 0 ? (
    <p>No items in cart</p>
  ) : (
    <div className="max-h-60 overflow-y-auto">
      <table className="min-w-full bg-white border border-gray-400">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Price</th>
            <th className="py-2 px-4 border-b text-left">Quantity</th>
            <th className="py-2 px-4 border-b text-left">Serial Number</th>
            <th className="py-2 px-4 border-b text-left">Remove</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b text-left">{item.item}</td>
              <td className="py-2 px-4 border-b text-left">{item.retail_price}</td>
              <td className="py-2 px-4 border-b text-left">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                  className="w-full px-2 py-1 border rounded" // Adjusted width to full
                />
              </td>
              <td className="py-2 px-4 border-b text-left">
  {item.products.length > 0 ? (
    <select
      value={item.selectedSerialNumbers[0] || ''}
      onChange={(e) => updateSerialNumber(index, e.target.value)}
      className="w-full px-2 py-1 border rounded"
    >
      <option value="">Select Serial Number</option>
      {item.products.map((product, idx) => (
        <option key={idx} value={product.serial_number}>
          {product.serial_number}
        </option>
      ))}
    </select>
  ) : (
    <span>No Serial Numbers</span>
  )}
</td>
              <td className="py-2 px-4 border-b text-left">
                <button
                  onClick={() => removeFromCart(index)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

<div className="mt-8 md:w-1/2 md:mr-auto"> {/* Changed md:ml-auto to md:mr-auto */}
  <h3 className="text-2xl font-bold mb-4">Total: ${total}</h3>
  <button
    onClick={handleSubmit}
    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
  >
    Submit
  </button>
</div>
    </div>
  );
}

export default InvoiceForm;
