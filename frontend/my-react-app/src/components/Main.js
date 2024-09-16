import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import RandomBtn from "./RandomBtn";
import Loading from "./Loading";
import Info from "./Info";
import { postLocation } from "../services/locationService";

function Main() {
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
    if (!isLoading && loadingStartTime) {
      const elapsedTime = Date.now() - loadingStartTime;
      const remainingTime = 3000 - elapsedTime;
      if (remainingTime > 0) {
        const timer = setTimeout(() => {
          navigate("/info");
        }, remainingTime);
        return () => clearTimeout(timer);
      } else {
        navigate("/info");
      }
    }
  }, [isLoading, loadingStartTime, navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/loading" element={<Loading />} />
        <Route
          path="/info"
          element={
            <Info
              info={restaurantInfo}
              setCurrentLocation={setCurrentLocation}
              setIsLoading={setIsLoading}
              currentLocation={currentLocation}
            />
          }
        />
        <Route
          path="/"
          element={
            <RandomBtn
              setCurrentLocation={setCurrentLocation}
              setIsLoading={setIsLoading}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default Main;
