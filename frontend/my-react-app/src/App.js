import { useEffect, useState } from "react";

import RandomBtn from "./components/RandomBtn";
import MapBtn from "./components/MapBtn";
import Loading from "./components/Loading";
import Info from "./components/Info";

import { postLocation } from "./services/locationService";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState({});

  useEffect(() => {
    if (currentLocation) {
      postLocation(currentLocation, setIsLoading, setRestaurantInfo);
    }
  }, [currentLocation]);

  // for debugging
  useEffect(() => {
    console.log(restaurantInfo);
  }, [restaurantInfo]);

  return (
    <div className="App">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* debug */}
          <p>{JSON.stringify(currentLocation)}</p>
          <Info info={restaurantInfo} />
          <RandomBtn
            setCurrentLocation={setCurrentLocation}
            setIsLoading={setIsLoading}
          />
          <MapBtn location={currentLocation} data={restaurantInfo} />
        </>
      )}
    </div>
  );
}

export default App;
