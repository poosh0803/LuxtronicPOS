import React, { useState, useEffect } from 'react';
import ClientDrawer from './ClientDrawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { hostaddress } from './App';

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // search bar
 


  // Fetch clients from the backend
  const fetchClients = () => {
    fetch(`${hostaddress}/client`)
      .then(response => response.json())
      .then(data => {
        const filteredClient = data.filter(client => 
          client.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.abn.includes(searchTerm)||
          client.telephone.includes(searchTerm)||
          client.email.toLowerCase().includes(searchTerm)
        );

        setClients(filteredClient);

  })
      .catch(error => {
        console.error('Error fetching clients:', error);
        alert('Failed to fetch clients');
      });

     


  };

  // Handle client deletion
  const handleDelete = (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      fetch(`${hostaddress}/client/${clientId}`, {
        method: 'DELETE',
      })
    
      .then(() => {
        alert('Client deleted successfully');
        fetchClients();  // Refresh the list after deletion
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Error deleting client: ' + error.message);
      });
    }
  };

  // Function to handle opening the drawer to edit a client
  const handleEdit = (client) => {
    setEditingClient(client);
    setIsDrawerOpen(true);
  };
  
  //Function to save client (either new or existing)
  const saveClient = (clientData) => {
    const url = editingClient ? `${hostaddress}/client/${editingClient.client_id}` : `${hostaddress}/client`;
    const method = editingClient ? 'PUT' : 'POST';
  
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData)
    })
  
    .then(() => {
      alert('Client saved successfully!');
      setIsDrawerOpen(false);
      fetchClients();  // Refresh the list
      setEditingClient(null);  // Reset the editing state
    })
    .catch(error => {
      console.error('Error saving client:', error);
      alert('Failed to save client: ' + error.message);
    });
  };

  
  
  

  // Open the drawer for adding a new client
  const openDrawer = () => {
    setEditingClient(null);  // Clear any previously edited client
    setIsDrawerOpen(true);
  };

  // Close the drawer and reset editing state
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingClient(null);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="container mx-auto px-4 mt-5 ">
      <div className="flex justify-between items-center my-5 ">
        <h2 className="ml-5 text-2xl font-bold">Client Management</h2>
        <button onClick={openDrawer} className="bg-orange-400 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded">
          Add New Client
        </button>
       </div>
       <ClientDrawer
        isOpen={isDrawerOpen}
        closeDrawer={closeDrawer}
        saveClient={saveClient}
        client={editingClient}
        fetchClients={fetchClients}
      />
      <hr class="h-px mt-3 mb-3 border-2 border-orange-500"></hr>
     
        <div className="relative flex items-center w-48 mt-6 ml-6 mb-4">
  <input
    type="text"
    placeholder="Search client..."
    className="border border-gray-400 size-8 text-sm p-2 pl-10 rounded-full w-full"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <FontAwesomeIcon
    icon={faMagnifyingGlass}
    className="absolute left-3 text-gray-300 hover:text-gray-700 cursor-pointer"
    onClick={fetchClients}
  />



  
</div>
      <div className="mx-5 overflow-x-auto shadow-md sm:rounded-lg max-h-[calc(105vh-200px)]">
        <table className="min-w-full text-sm text-center text-gray-500">
          <thead className="bg-orange-400 text-white">
            <tr>
              <th className="py-3 px-4  uppercase font-semibold">Client ID</th>
              <th className="py-3 px-4  uppercase font-semibold">Company Name</th>
              <th className="py-3 px-4 uppercase font-semibold">Client Name</th>
              <th className="py-3 px-4 uppercase font-semibold">ABN</th>
              <th className="py-3 px-4 uppercase font-semibold">Telephone</th>
              <th className="py-3 px-4 uppercase font-semibold">Email Address</th>
              <th className="py-3 px-4 uppercase font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {clients.map(client => (
              <tr key={client.client_id} className="hover:bg-orange-100 border-b">
                <td className="py-3 px-4">{client.client_id}</td>
                <td className="py-3 px-4">{client.company_name}</td>
                <td className="py-3 px-4">{client.client_name}</td>
                <td className="py-3 px-4">{client.abn}</td>
                <td className="py-3 px-4">{client.telephone}</td>
                <td className="py-3 px-4">{client.email}</td>
                <td className="py-3 px-4 flex space-x-4">
                  <FontAwesomeIcon icon={faEdit} className="text-green-500 hover:text-green-700 cursor-pointer" onClick={() => handleEdit(client)} />
                  <FontAwesomeIcon icon={faTrash} className="text-red-500 hover:text-red-700 cursor-pointer" onClick={() => handleDelete(client.client_id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientManagement;