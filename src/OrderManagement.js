import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import OrderTypeModel from './OrderTypeModel'; // Import the OrderTypeModal component
import InvoiceForm from './InvoiceForm';
import { useNavigate } from "react-router-dom"
import { hostaddress } from './App';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderTypeModal, setShowOrderTypeModal] = useState(false);
    const [orderType, setOrderType] = useState(null); // State to store the selected order type
    const navigate = useNavigate(); //used to navigate to inventoryitems page

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${hostaddress}/orders`);
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Failed to fetch orders');
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleEdit = (order) => {
        // Handle edit order
    };

    const handleDelete = async (orderId) => {
        // Handle delete order
        if (window.confirm("Are you sure you want to delete this order?")) {
        try {
            await axios.delete(`${hostaddress}/orders/${orderId}`);
            fetchOrders(); // Update users list after deletion
          } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order. Please try again.');
          }
        }
    };

    const openModal = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    const handleInvoiceClick = () => {
      // Show the order type modal when the "Invoice" button is clicked
      setShowOrderTypeModal(true);
    };
  
    const handleOrderTypeSelection = (type) => {
      // Set the selected order type and navigate to the InvoiceForm
      setOrderType(type);
      navigate('/InvoiceForm');
    };

    return (
        <div className="container mx-auto px-4 mt-5">
            <div className="flex justify-between items-center my-5">
                <h2 className="ml-5 text-2xl font-bold">Order Management</h2>
                <div className="ml-4">
              <button
                  className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleInvoiceClick} 
              >
            Add Order
        </button>
        </div>
        

            </div>
            <hr class="h-px mt-3 mb-3 border-2 border-orange-500"></hr>
            <div className="mx-5 overflow-x-auto shadow-md sm:rounded-lg max-h-[calc(105vh-200px)]">
                <table className="min-w-full text-sm text-center text-gray-500">
                    <thead className="bg-orange-400 text-white">
                        <tr>
                            <th className="py-3 px-4 uppercase font-semibold">Order ID</th>
                            <th className="py-3 px-4 uppercase font-semibold">Client Name</th>
                            <th className="py-3 px-4 uppercase font-semibold">Invoice No</th>
                            <th className="py-3 px-4 uppercase font-semibold">Due Date</th>
                            <th className="py-3 px-4 uppercase font-semibold">Discount</th>
                            <th className="py-3 px-4 uppercase font-semibold">Total Amount</th>
                            <th className="py-3 px-4 uppercase font-semibold">Payment Method</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {orders.map(order => (
                            <tr className="hover:bg-orange-100 border-b " key={order.id}>
                                <td className="py-3 px-4">{order.id}</td>
                                <td className="py-3 px-4">{order.clientName}</td>
                                <td className="py-3 px-4">{order.invoiceNo}</td>
                                <td className="py-3 px-4">{new Date(order.dueDate).toLocaleDateString()}</td>
                                <td className="py-3 px-4">{order.discount}</td>

                                <td className="py-3 px-4">${order.totalAmount}</td>
                                <td className="py-3 px-4">{order.paymentMethod}</td>
                                <td className="py-3 px-4">
                                    <FontAwesomeIcon icon={faEdit} className="ml-2 text-green-500 hover:text-green-700 cursor-pointer" onClick={() => handleEdit(order)} />
                                    <FontAwesomeIcon icon={faTrash} className="ml-2 text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(order.id)} />
                                    <button className="ml-2" onClick={() => openModal(order)}>View Details</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={selectedOrder !== null} onRequestClose={closeModal}>
    {selectedOrder && (
        <div className="p-6">
            <h2 className="text-2xl mb-4">Order Details</h2>
            <div>
                <p><strong>Client Name:</strong> {selectedOrder.clientName}</p>
                <p><strong>Company Name:</strong> {selectedOrder.companyName}</p>
                <p><strong>Telephone:</strong> {selectedOrder.telephone}</p>
                <p><strong>Email:</strong> {selectedOrder.email}</p>
                <p><strong>Invoice No:</strong> {selectedOrder.invoiceNo}</p>
                <p><strong>Due Date:</strong> {new Date(selectedOrder.dueDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ${selectedOrder.totalAmount}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
            </div>
            <h3 className="text-xl mt-4">Order Items</h3>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border py-2 px-4">Item</th>
                        <th className="border py-2 px-4">Quantity</th>
                        <th className="border py-2 px-4">Serial Number</th>
                        <th className="border py-2 px-4">Price</th>
                    </tr>
                </thead>
                <tbody>
                {selectedOrder.details.map((detail, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                        <td className="border py-2 px-4 text-center">{detail.item}</td>
                        <td className="border py-2 px-4 text-center">{detail.quantity}</td>
                        <td className="border py-2 px-4 text-center">{detail.serialNumber}</td>
                        <td className="border py-2 px-4 text-center">${detail.price}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={closeModal}>Close</button>
        </div>
    )}
</Modal>
{showOrderTypeModal && (
        <OrderTypeModel onSelectOrderType={handleOrderTypeSelection} />
      )}

{orderType && (
  <InvoiceForm orderType={orderType} />
)}
        </div>
    );
};

export default OrderManagement;