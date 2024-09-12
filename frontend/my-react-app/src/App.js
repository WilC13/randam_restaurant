import "./App.css";
import RandomBtn from "./Component/RandomBtn";
import MapBtn from "./Component/MapBtn";
import Loading from "./Component/Loading";
import Info from "./Component/Info";

import { useEffect, useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState({});

  useEffect(() => {
    if (currentLocation) {
      postLocation(currentLocation);
    }
  }, [currentLocation]);

  // for debugging
  useEffect(() => {
    console.log(restaurantInfo);
  }, [restaurantInfo]);

  const postLocation = async (location) => {
    console.log(location);
    setIsLoading(true);
    const local = "http://localhost:5000/api/location";
    const render = "https://randam-restaurant.onrender.com/api/location";
    try {
      const res = await fetch(render, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });
      const data = await res.json();
      setRestaurantInfo(data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* debug */}
          <p>{JSON.stringify(currentLocation)}</p>
          <Info info={restaurantInfo} />
          <RandomBtn setCurrentLocation={setCurrentLocation} />
          <MapBtn location={currentLocation} data={restaurantInfo} />
        </>
      )}
    </div>
  );
}

export default App;
