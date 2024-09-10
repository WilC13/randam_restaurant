import "./App.css";
import Btn from "./HomePage/Btn";
import MyMap from "./HomePage/MyMap";
import { useEffect, useState } from "react";

function App() {
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (currentLocation) {
      postLocation(currentLocation);
    }
  }, [currentLocation]);

  const postLocation = async (location) => {
    console.log(location);
    try {
      const res = await fetch("http://localhost:5000/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="App">
      <Btn setCurrentLocation={setCurrentLocation} />
      <p>{JSON.stringify(currentLocation)}</p>
      <button
        onClick={() => {
          setShowMap(!showMap);
        }}
      >
        click
      </button>
      {showMap && (
        <MyMap latitude={currentLocation.lat} longitude={currentLocation.lng} />
      )}
    </div>
  );
}

export default App;
