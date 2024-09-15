import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import RandomBtn from "./components/RandomBtn";
import MapBtn from "./components/MapBtn";
import Loading from "./components/Loading";
import Info from "./components/Info";

import { postLocation } from "./services/locationService";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentLocation) {
      setLoadingStartTime(Date.now());
      setIsLoading(true);
      postLocation(currentLocation, setIsLoading, setRestaurantInfo);
      navigate("/loading");
    }
  }, [currentLocation, navigate]);

  useEffect(() => {
    if (isLoading && loadingStartTime) {
      const elapsedTime = Date.now() - loadingStartTime;
      const remainingTime = 3000 - elapsedTime;
      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
        return () => clearTimeout(timer);
      } else {
        setIsLoading(false);
        navigate("/info");
      }
    }
  }, [isLoading, loadingStartTime, navigate]);

  // for debugging
  useEffect(() => {
    console.log(restaurantInfo);
  }, [restaurantInfo]);

  return (
    <Router>
      <div className="App">
        {/* {isLoading ? (
          <Loading />
        ) : (
          <>
            <Info info={restaurantInfo} />
            <RandomBtn
              setCurrentLocation={setCurrentLocation}
              setIsLoading={setIsLoading}
            />
            {currentLocation && (
              <MapBtn location={currentLocation} data={restaurantInfo} />
            )}
          </>
        )} */}
        <Routes>
          <Route path="/loading" element={<Loading />} />
          <Route path="/info" element={<Info info={restaurantInfo} />} />
          <Route
            path="/"
            element={
              <RandomBtn
                setCurrentLocation={setCurrentLocation}
                setIsLoading={setIsLoading}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
