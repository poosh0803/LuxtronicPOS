import React from 'react';

//change text colour depending on string text
const StatusText = ({ status }) => {
  let textColour = '';

  //if in stock change text colour to green 
  if (status === 'In Stock') {
    textColour = 'text-green-500';
    //if out of stock change text colour to red
    } else if (status === 'Out of Stock') {
        textColour = 'text-red-500';
    } else if (status === 'Pending') {
      textColour = 'text-orange-500';
    }


  return <span className={textColour}>{status}</span>;
};

export default StatusText;