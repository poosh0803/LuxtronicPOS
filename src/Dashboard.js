import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Barcode from 'react-barcode';
import { useNavigate } from "react-router-dom";
import { hostaddress } from './App';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [recentInventory, setRecentInventory] = useState([]);
    const [topItems, setTopItems] = useState([]);
    const [topDamaged, setTopDamaged] = useState([]);
    const [topInStock, setTopInSTock] = useState([]);
    const [purchasedData, setPurchasedData] = useState([]);
    
    

    useEffect(() => {
        fetchBookings();
        fetchInventory();
        fetchTopItems();
        fetchTopDamaged();
        fetchTopInStock();
        fetchPurchasedData();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${hostaddress}/bookings`);
            const data = await response.json();
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcomingBookings = data.filter(booking => new Date(booking.date) >= today)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 6);
            
            setBookings(upcomingBookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            alert('Failed to fetch bookings. Please check your connection and try again.');
        }
    };

    const fetchInventory = () => {
        fetch(`${hostaddress}/inventory`)
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setRecentInventory(sortedData.slice(0, 5)); // Get the last 5 items
            })
            .catch(error => {
                console.error('Error fetching inventory:', error);
                alert('Failed to fetch inventory. Please check your connection and try again.');
            });
    };

const fetchTopItems = async () => {
    try {
        const response = await fetch(`${hostaddress}/top-inventory-purchases`);
        const data = await response.json();
        setTopItems(data);
    } catch (error) {
        console.error('Error fetching top inventory purchases:', error);
        alert('Failed to fetch top inventory purchases. Please check your connection and try again.');
    }
};

const getChartData = () => {
    const labels = topItems.map(item => item.item); // Use item name instead of inventory_id
    const data = topItems.map(item => item.total_purchased);

    return {
        labels,
        datasets: [{
            label: 'Total Purchases',
            data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }],
    };
};

const getChartOptions = () => {
    return {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, // Ensures that the steps between ticks are whole numbers
                    precision: 0 // Forces the ticks to be integers
                }
            }
        },

    };
};



const fetchTopDamaged = async () => {
    try {
        const response = await fetch(`${hostaddress}/top-damaged-inventory`);
        const data = await response.json();
        setTopDamaged(data);
    } catch (error) {
        console.error('Error fetching top damaged inventory:', error);
        alert('Failed to fetch top damaged inventory. Please check your connection and try again.');
    }
};

const getDamagedChartData = () => {
    const labels = topDamaged.map(item => item.item); // Using the item names as labels
    const data = topDamaged.map(item => item.total_damaged);

    return {
        labels,
        datasets: [{
            label: 'Total Damaged',
            data,
          backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };
};



// top 3 instock

const fetchTopInStock = async () => {
    try {
        const response = await fetch(`${hostaddress}/top-instock-inventory`);
        const data = await response.json();
        setTopInSTock(data);
    } catch (error) {
        console.error('Error fetching top in stock inventory:', error);
        alert('Failed to fetch top in stock inventory. Please check your connection and try again.');
    }
};

const getInStockChartData = () => {
    const labels = topInStock.map(item => item.item); // Using the item names as labels
    const data = topInStock.map(item => item.total_instock);

    return {
        labels,
        datasets: [{
            label: 'Total In Stock',
            data,
          backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(75, 192, 192, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
        }]
    };
};

// fetch pie chart data 
const fetchPurchasedData = async () => {
    try {
        const response = await fetch(`${hostaddress}/purchased-inventory-products`);
        const data = await response.json();
        setPurchasedData(data);
    } catch (error) {
        console.error('Error fetching purchased inventory data:', error);
        alert('Failed to fetch purchased inventory data. Please check your connection and try again.');
    }
};

const getPurchasedChartData = () => {
    const labels = purchasedData.map(item => item.item);
    const data = purchasedData.map(item => item.total_purchased);

    return {
        labels,
        datasets: [{
            label: 'Purchased Inventory',
            data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)', // Red
                'rgba(54, 162, 235, 0.5)', // Blue
                'rgba(255, 206, 86, 0.5)', // Yellow
                'rgba(75, 192, 192, 0.5)', // Green
                'rgba(153, 102, 255, 0.5)', // Purple
                'rgba(255, 159, 64, 0.5)', // Orange
                'rgba(199, 199, 199, 0.5)', // Grey
                'rgba(163, 228, 215, 0.5)', 
                'rgba(250, 128, 114, 0.5)', // Salmon
                'rgba(255, 218, 185, 0.5)', // Peach
                'rgba(233, 30, 99, 0.5)',  // Pink
                'rgba(0, 188, 212, 0.5)',  // Cyan
                'rgba(0, 150, 136, 0.5)',  
                'rgba(76, 175, 80, 0.5)',  // Light Green
                'rgba(205, 220, 57, 0.5)', // Lime
                'rgba(255, 87, 34, 0.5)',  // Deep Orange
                'rgba(121, 85, 72, 0.5)',  // Brown
                'rgba(96, 125, 139, 0.5)', // Blue Grey
                'rgba(244, 67, 54, 0.5)',  // Red
                'rgba(233, 30, 99, 0.5)',  // Pink
                'rgba(156, 39, 176, 0.5)', // Purple
                'rgba(103, 58, 183, 0.5)', // Deep Purple
                'rgba(63, 81, 181, 0.5)',  // Indigo
                'rgba(33, 150, 243, 0.5)', // Blue
                'rgba(3, 169, 244, 0.5)',  // Light Blue
                'rgba(0, 188, 212, 0.5)',  // Cyan
                'rgba(0, 150, 136, 0.5)',  // Teal
                'rgba(76, 175, 80, 0.5)',  // Green
                'rgba(139, 195, 74, 0.5)', // Light Green
                'rgba(205, 220, 57, 0.5)', // Lime
                'rgba(255, 235, 59, 0.5)', // Yellow
                'rgba(255, 193, 7, 0.5)',  // Amber
                'rgba(255, 152, 0, 0.5)',  // Orange
                'rgba(255, 87, 34, 0.5)',  // Deep Orange
                'rgba(121, 85, 72, 0.5)',  // Brown
                'rgba(158, 158, 158, 0.5)',// Grey
                'rgba(96, 125, 139, 0.5)', // Blue Grey
                'rgba(244, 143, 177, 0.5)',
                'rgba(179, 157, 219, 0.5)',
                'rgba(159, 168, 218, 0.5)',
                'rgba(144, 202, 249, 0.5)',
                'rgba(129, 212, 250, 0.5)',
                'rgba(128, 222, 234, 0.5)',
                'rgba(128, 203, 196, 0.5)',
                'rgba(165, 214, 167, 0.5)',
                'rgba(197, 225, 165, 0.5)',
                'rgba(230, 238, 156, 0.5)',
                'rgba(255, 245, 157, 0.5)',
                'rgba(255, 224, 130, 0.5)',
                'rgba(255, 204, 128, 0.5)' 
            ],

            hoverBackgroundColor: [
                'rgba(255, 99, 132, 0.8)', 
                'rgba(54, 162, 235, 0.8)', 
                'rgba(255, 206, 86, 0.8)', 
                'rgba(75, 192, 192, 0.8)', 
                'rgba(153, 102, 255, 0.8)', 
                'rgba(255, 159, 64, 0.8)', 
                'rgba(199, 199, 199, 0.8)', 
                'rgba(163, 228, 215, 0.8)', 
                'rgba(250, 128, 114, 0.8)', 
                'rgba(255, 218, 185, 0.8)', 
                'rgba(233, 30, 99, 0.8)',  
                'rgba(0, 188, 212, 0.8)',  
                'rgba(0, 150, 136, 0.8)',  
                'rgba(76, 175, 80, 0.8)',  
                'rgba(205, 220, 57, 0.8)', 
                'rgba(255, 87, 34, 0.8)',  
                'rgba(121, 85, 72, 0.8)',  
                'rgba(96, 125, 139, 0.8)', 
                'rgba(244, 67, 54, 0.8)',  
                'rgba(233, 30, 99, 0.8)',  
                'rgba(156, 39, 176, 0.8)', 
                'rgba(103, 58, 183, 0.8)', 
                'rgba(63, 81, 181, 0.8)', 
                'rgba(33, 150, 243, 0.8)', 
                'rgba(3, 169, 244, 0.8)',  
                'rgba(0, 188, 212, 0.8)',  
                'rgba(0, 150, 136, 0.8)',  
                'rgba(76, 175, 80, 0.8)',  
                'rgba(139, 195, 74, 0.8)', 
                'rgba(205, 220, 57, 0.8)', 
                'rgba(255, 235, 59, 0.8)', 
                'rgba(255, 193, 7, 0.8)',  
                'rgba(255, 152, 0, 0.8)',  
                'rgba(255, 87, 34, 0.8)',  
                'rgba(121, 85, 72, 0.8)',  
                'rgba(158, 158, 158, 0.8)',
                'rgba(96, 125, 139, 0.8)', 
                'rgba(244, 143, 177, 0.8)',
                'rgba(179, 157, 219, 0.8)',
                'rgba(159, 168, 218, 0.8)',
                'rgba(144, 202, 249, 0.8)',
                'rgba(129, 212, 250, 0.8)',
                'rgba(128, 222, 234, 0.8)',
                'rgba(128, 203, 196, 0.8)',
                'rgba(165, 214, 167, 0.8)',
                'rgba(197, 225, 165, 0.8)',
                'rgba(230, 238, 156, 0.8)',
                'rgba(255, 245, 157, 0.8)',
                'rgba(255, 224, 130, 0.8)',
                'rgba(255, 204, 128, 0.8)' 
            ],
            
        }]
    };
};










   return (
    <div className="container mx-auto px-4 mt-5">
        <div className="flex justify-between items-center my-6">
        <h2 className="ml-5 text-2xl font-bold">Dashboard Page</h2>

        </div>
        <hr class="h-px mt-3 mb-3 border-2 border-orange-500"></hr>
        <BookingTable bookings={bookings} />
        <div className="flex flex-wrap -mx-2 pt-10"> 
            {/* Graphs */}
            <div className="w-full md:w-1/3 px-2 mb-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-5">
                    <h2 className="text-xl pb-5">Top 3 Inventory Purchases</h2>
                    <Bar data={getChartData()} options={getChartOptions()} />
                </div>
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-5">
                    <h2 className="text-xl pb-5">Top 3 Damaged Inventory Items</h2>
                    <Bar data={getDamagedChartData()} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
                </div>
            </div>
            <div className="w-full md:w-1/3 px-2 mb-4">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-5">
                    <h2 className="text-xl pb-5">Top 3 In Stock Inventory Items</h2>
                    <Bar data={getInStockChartData()} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
                </div>
            </div>
        </div>

        {/* Inventory Table and Pie Chart */}
        <div className="flex flex-wrap -mx-2">
            <div className="w-full md:w-2/3 px-2">
                <InventoryTable recentInventory={recentInventory} />
            </div>
            <div className="w-full md:w-1/3 px-2 mt-10">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden p-5">
                    <h2 className="text-2xl pb-5">Item Sold Distribution</h2>
                    <div className="chart-container">
                    <Pie data={getPurchasedChartData()} />
                     </div>
                </div>
            </div>
        </div>
    </div>
);

};

const BookingTable = ({ bookings }) => (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden p-5'>
        <h2 className="text-xl pb-3 ">Upcoming Bookings</h2>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="bg-orange-400 text-white">
                    <tr>
                        <th className="py-3 px-4 uppercase font-semibold">First Name</th>
                        <th className="py-3 px-4 uppercase font-semibold">Last Name</th>
                        <th className="py-3 px-4 uppercase font-semibold">Email</th>
                        <th className="py-3 px-4 uppercase font-semibold">Phone Number</th>
                        <th className="py-3 px-4 uppercase font-semibold">Service Type</th>
                        <th className="py-3 px-4 uppercase font-semibold">Date</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {bookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-orange-100 border-b">
                            <td className="py-3 px-4">{booking.first_name}</td>
                            <td className="py-3 px-4">{booking.last_name}</td>
                            <td className="py-3 px-4">{booking.email}</td>
                            <td className="py-3 px-4">{booking.phone_number}</td>
                            <td className="py-3 px-4">{booking.service_type}</td>
                            <td className="py-3 px-4">{new Date(booking.date).toLocaleDateString('en-GB')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);





const InventoryTable = ({ recentInventory }) => {
    const navigate = useNavigate();  // Properly initialize `useNavigate` inside the component

    // Function to handle item click
    const handleItemClick = (inventoryId) => {
        navigate(`/InventoryItems/${inventoryId}`);
    };

    return (
        <div className="mt-10 bg-white rounded-lg shadow-lg overflow-hidden p-5">
            <h2 className="text-2xl pb-3">Recently Added Inventory</h2>
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="bg-orange-400 text-white">
                        <tr>
                            <th className="py-3 px-4 uppercase font-semibold">Item</th>
                            <th className="py-3 px-4 uppercase font-semibold">Quantity</th>
                            <th className="py-3 px-4 uppercase font-semibold">Price</th>
                            <th className="py-3 px-4 uppercase font-semibold">Barcode</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {recentInventory.map(item => (
                            <tr key={item.inventory_id} className="hover:bg-orange-100 border-b">
                                <td className="py-3 px-4 cursor-pointer hover:text-blue-500 hover:underline" onClick={() => handleItemClick(item.inventory_id)}>{item.item}</td>
                                <td className="py-3 px-4">{item.quantity}</td>
                                <td className="py-3 px-4">${item.retail_price}</td>
                                <td className="py-3 px-4"><Barcode value={String(item.barcode)} width={1.5} height={20}/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default Dashboard;
