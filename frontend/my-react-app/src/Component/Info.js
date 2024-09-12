import React from 'react';
const price = {"0": "超平",
    "1": "平",
    "2": "中等",
    "3":"貴",
    "4": "超貴"
   }
function Info({ info }) {
  if (!info || Object.keys(info).length === 0) {
    return <></>;
  }

  return (
    <div>
      <h2>{info.name}</h2>
      <p>Address: {info.vicinity}</p>
      <img 
            src={`http://localhost:5000/api/photo?photo_reference=${info.photos[0].photo_reference}`}
            alt={info.name} 
            // style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain' }} 
            style={{ maxWidth: '33vm', maxHeight: '33vh', objectFit: 'contain' }} 
          />
      <p>Rating: {info.rating}</p>
      <p>Price Level: {price[info.price_level]}</p>
    </div>
  );
}

export default Info;


