import React from 'react';

const OrderTypeModel = ({ onSelectOrderType }) => {
  const handleOrderTypeSelection = (type) => {
    // Call the parent component's onSelectOrderType function with the selected order type
    onSelectOrderType(type);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Select Order Type</h2>
        <div>
          <button onClick={() => handleOrderTypeSelection('booking')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-4">Booking Service</button>
          <button onClick={() => handleOrderTypeSelection('walkIn')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full mr-4">Walk-in Order</button>
          <button onClick={() => handleOrderTypeSelection('online')} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full">Online Order</button>
        </div>
      </div>
    </div>
  );
};

export default OrderTypeModel;