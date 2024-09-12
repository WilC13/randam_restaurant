import "./App.css";
import RandomBtn from "./Component/RandomBtn";
import MapBtn from "./Component/MapBtn";
import Loading from "./Component/Loading";
import Info from "./Component/Info";

// import MyMap from "./Component/MyMap";
import { useEffect, useState } from "react";

function App() {
  // const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState({});

  useEffect(() => {
    if (currentLocation) {
      postLocation(currentLocation);
    }
  }, [currentLocation]);

  useEffect(() => {
    console.log(restaurantInfo);
  }, [restaurantInfo]);

  const postLocation = async (location) => {
    console.log(location);
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });
      const data = await res.json();
      setRestaurantInfo(data.result);
      
      
      // console.log(`${dir_url}&${params}`);
      // window.location.href = `${dir_url}&${params}`;
      // window.open(`${dir_url}&${params}`);
    } catch (err) {
      console.error(err);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      {isLoading ? (<Loading /> ):
        (
        <>
          {/* <p>{JSON.stringify(currentLocation)}</p> */}
          <Info info={restaurantInfo} />
          <RandomBtn setCurrentLocation={setCurrentLocation} />
          <MapBtn location={currentLocation} data={restaurantInfo} />
        </>)
            }      {/* <button
        onClick={() => {
          setShowMap(!showMap);
        }}
      >
        click
      </button> */}
      {/* {showMap && (
        <MyMap latitude={currentLocation.lat} longitude={currentLocation.lng} />
      )} */}
    </div>
  );
}

export default App;
