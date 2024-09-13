// import { useState, useEffect } from "react";

// const RandomBtn = ({ setCurrentLocation }) => {
//   const [watchId, setWatchId] = useState(null);

//   const handleGetLocation = () => {
//     if (navigator.geolocation) {
//       const id = navigator.geolocation.watchPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setCurrentLocation({ latitude: latitude, longitude: longitude });
//         },
//         (error) => {
//           console.error(error);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 5000,
//           maximumAge: 0,
//         }
//       );
//       setWatchId(id);
//     } else {
//       console.error("Geolocation is not supported by this browser.");
//     }
//   };

//   useEffect(() => {
//     return () => {
//       if (watchId !== null) {
//         navigator.geolocation.clearWatch(watchId);
//       }
//     };
//   }, [watchId]);

//   return <button onClick={handleGetLocation}>Get Current Location</button>;
// };

// export default RandomBtn;

function RandomBtn({ setCurrentLocation }) {
  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          alert(err.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      alert("Geolocation is not supproted by your broswer");
    }
  };

  return (
    <>
      <button onClick={getGeolocation}>Get Location</button>
    </>
  );
}

export default RandomBtn;
