import React, { useState, useEffect } from 'react';
import InventoryDrawer from './InventoryDrawer'; // Adjust the relative path as needed
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Popup from 'reactjs-popup';
import Barcode from 'react-barcode';
import 'reactjs-popup/dist/index.css';
import { useNavigate } from "react-router-dom";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import StatusText from './StatusText';
import { hostaddress } from './App';

const InventoryManagement = () => {
    const [inventory, setInventory] = useState([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingInventory, setEditingInventory] = useState(null);
    const navigate = useNavigate(); //used to navigate to inventoryitems page
    const [searchTerm, setSearchTerm] = useState(''); // search bar


    const fetchInventory = () => {
        fetch(`${hostaddress}/inventory`)
            .then(response => response.json())
            .then(async data => {
                const filteredInventory = data.filter(item =>
                    (item.item && item.item.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    
                    (item.price_from_supplier !== null && item.price_from_supplier.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (item.retail_price !== null && item.retail_price.toString().toLowerCase().includes(searchTerm.toLowerCase()))
                );
                setInventory(filteredInventory);
                
                // Fetch item details for each inventory item
                const updatedInventory = await Promise.all(data.map(async item => {
                    const url = `${hostaddress}/inventory/${item.inventory_id}`;

                    const itemResponse = await fetch(url);
                    const itemDetails = await itemResponse.json();

                    // Calculate quantity and status based on products
                    const availableProducts = itemDetails.products.filter(product => product.status === 'In Stock');
                    const quantity = availableProducts.length;
                    const status = quantity >= 1 ? 'In Stock' : 'Out of Stock';

                    return {
                        ...item,
                        quantity,
                        status
                    };
                }));

                setInventory(updatedInventory);
                
            })
            .catch(error => {
                console.error('Error fetching inventory:', error);
                alert('Failed to fetch inventory');
            });
    };
   

    

    // Function to handle item click and navigate to InventoryItems with item ID
    const handleItemClick = (inventoryId) => {
        navigate(`/InventoryItems/${inventoryId}`);
    };

    const handleDelete = (inventoryId) => {
        if (window.confirm("Are you sure you want to delete this inventory item?")) {
            fetch(`${hostaddress}/inventory/${inventoryId}`, { method: 'DELETE' })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to delete inventory');
                    return response.json();
                })
                .then(() => {
                    fetchInventory();
                    alert('Inventory item deleted successfully');
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error deleting inventory: ' + error.message);
                });
        }
    };

    const handleEdit = (inventory) => {
        setEditingInventory(inventory);
        setIsDrawerOpen(true);
    };

    const saveInventory = (inventoryData) => {
        const url = editingInventory ? `/inventory/${editingInventory.inventory_id}` : '/inventory';
        const method = editingInventory ? 'PUT' : 'POST';
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inventoryData)
        })
            .then(response => response.json())
            .then(() => {
                alert('Inventory saved successfully!');
                setIsDrawerOpen(false);
                fetchInventory();
                setEditingInventory(null);
            })
            .catch(error => alert('Failed to save inventory: ' + error.message));
    };

    useEffect(() => {
        fetchInventory();
    }, []);
    

    

    return (
        <div className="container mx-auto px-4 mt-5">
            <div className="flex justify-between items-center my-5">
            <h2 className="ml-5 text-2xl font-bold">Inventory Management</h2>
                <button onClick={() => setIsDrawerOpen(true)} className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
                     Add New Inventory
                    </button>
            </div>

            <InventoryDrawer isOpen={isDrawerOpen} 
            closeDrawer={() => setIsDrawerOpen(false)} 
            saveInventory={saveInventory} 
            editMode={editingInventory !== null} 
            editData={editingInventory}
            fetchInventory={fetchInventory}  />
            <hr class="h-px mt-3 mb-3 border-2 border-orange-500"></hr>
                <div className="relative flex items-center w-48 mt-6 ml-6 mb-4">
                    
                    
                    <input
                        type="text"
                        placeholder="Search Inventory..."
                        className="border border-gray-400 size-8 text-sm p-2 pl-10 rounded-full w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    
                    />
                    <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="absolute left-3 text-gray-300 hover:text-gray-700 cursor-pointer"
                        onClick={fetchInventory}

                    />



                    
                   

              
            </div>
           
            <div className="mx-5 overflow-x-auto shadow-md sm:rounded-lg max-h-[calc(105vh-200px)]">
                <table className="min-w-full text-sm text-center text-gray-500">
                    <thead className="bg-orange-400 text-white">
                        <tr>
                            <th className="py-3 px-4 uppercase font-semibold">ITEMS</th>
                            <th className="py-3 px-4 uppercase font-semibold">STATUS</th>
                            <th className="py-3 px-4 uppercase font-semibold">Quantity</th>
                            <th className="py-3 px-4 uppercase font-semibold">Price from Supplier</th>
                            <th className="py-3 px-4 uppercase font-semibold">Retail Price</th>
                            <th className="py-3 px-4 uppercase font-semibold">Supplier Name</th>
                            <th className="py-3 px-4 uppercase font-semibold">Supplier Email</th>
                            <th className="py-3 px-4 uppercase font-semibold">Barcode</th>
                            <th className="py-3 px-4"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {inventory.map(item => (
                            <tr className="hover:bg-orange-100 border-b " key={item.inventory_id}>
                                <td className="py-3 px-4 cursor-pointer hover:text-blue-500 hover:underline" onClick={() => handleItemClick(item.inventory_id)}>{item.item}</td>
                                <td className="py-3 px-4 "><StatusText status={item.status} /></td>
                                <td className="py-3 px-4">{item.quantity}</td>
                                <td className="py-3 px-4">${item.price_from_supplier}</td>
                                <td className="py-3 px-4">${item.retail_price}</td>
                                <td className="py-3 px-4">{item.supplier_name}</td>
                                <td className="py-3 px-4">{item.supplier_email}</td>
                                <td className="py-3 px-4"><Barcode value={item.barcode} width={1.5} height={40}/></td>
                                <td className="py-3 px-4">
                                    <Popup trigger=
                                        {<FontAwesomeIcon icon={faCircleInfo} className="ml-2 text-green-500 hover:text-green-700 cursor-pointer"/>}
                                            position="left center">
                                        <div className="font-bold underline uppercase text-center">{item.item}</div>
                                        
                                        <div className="py-1"><span className="px-2 font-bold">Model -</span>{item.model}</div>
                                        <div className="py-1"><span className="px-2 font-bold">Brand -</span>{item.brand}</div>
                                        <div className="py-1"><span className="px-2 font-bold">Brief Description -</span></div>  
                                        <div className="px-2">{item.brief_description}</div> 
                                        <div>
                                            <img src={item.image_url} alt={item.item} className="h-16 w-auto" />
                                        </div>   
                                    </Popup>
                                    <FontAwesomeIcon icon={faEdit} className="ml-2 text-green-500 hover:text-green-700 cursor-pointer" onClick={() => handleEdit(item)} />
                                    <FontAwesomeIcon icon={faTrash} className="ml-2 text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(item.inventory_id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryManagement;