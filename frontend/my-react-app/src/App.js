import "./App.css";
import Btn from "./HomePage/Btn";
import Loading from "./HomePage/Loading";
// import MyMap from "./HomePage/MyMap";
import { useEffect, useState } from "react";

function App() {
  // const [showMap, setShowMap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  

  useEffect(() => {
    if (currentLocation) {
      postLocation(currentLocation);
    }
  }, [currentLocation]);

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
      console.log(data);
      const dir_url = "https://www.google.com/maps/dir/?api=1"
      const params = new URLSearchParams({
        latitude: location.lat,
        longitude: location.lng,
        destination: data.result.name,
        destination_place_id: data.result.place_id,
        travelmode: "walking", 
      }).toString();
      console.log(`${dir_url}&${params}`);
      // window.location.href = `${dir_url}&${params}`;
      window.open(`${dir_url}&${params}`);
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
          <Btn setCurrentLocation={setCurrentLocation} />
          <p>{JSON.stringify(currentLocation)}</p>
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
