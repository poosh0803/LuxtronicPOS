import React, { useState } from 'react';

const DropdownMenu = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative inline-block text-left">
      <div onClick={toggleMenu}>
        {trigger}
      </div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;