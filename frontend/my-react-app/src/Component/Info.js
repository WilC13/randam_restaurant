import React from 'react';

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
    </div>
  );
}

export default Info;

