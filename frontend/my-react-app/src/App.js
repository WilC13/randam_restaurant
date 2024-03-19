import "./App.css";
import Btn from "./HomePage/Btn";
import MyMap from "./HomePage/MyMap";
import { useEffect, useState } from "react";

function App() {
  const [showMap, setShowMap] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (currentLocation !== null) {
      setShowMap(true);
    }
  }, [currentLocation]);

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
      {showMap && <MyMap />}
    </div>
  );
}

export default App;
