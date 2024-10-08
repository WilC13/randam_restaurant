import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import { postLocation } from "../services/locationService";

import RandomBtn from "./RandomBtn";
import Loading from "./Loading";
import Info from "./Info";
import RandomTextAnimation from "./RandomTextAnimation";

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
      // console.log(currentLocation)
      postLocation(currentLocation, setIsLoading, setRestaurantInfo);
      // navigate("/loading");
    }
  }, [currentLocation]);

  useEffect(() => {
    if (!isLoading && loadingStartTime && Object.keys(restaurantInfo).length > 0) {
      const elapsedTime = Date.now() - loadingStartTime;
      const remainingTime = 3000 - elapsedTime;
      if (remainingTime <= 0) {
        navigate("/info");
      } else {
        const timer = setTimeout(() => {
          navigate("/info");
        }, remainingTime);
        return () => clearTimeout(timer); // Clean up the timer on component unmount
      }
    }
  }, [isLoading, loadingStartTime, restaurantInfo, navigate]);

  const renderRandomTextAnimations = (count) => {
    return Array.from({ length: count }, (_, index) => (
      <RandomTextAnimation key={index} />
    ));
  };

  return (
    <>
      <Routes>
        <Route
          path="/loading"
          element={
            <>
              <Loading className="loading" />
              {renderRandomTextAnimations(3)}
            </>
          }
        />
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
            <>
              <RandomBtn
                setCurrentLocation={setCurrentLocation}
                setIsLoading={setIsLoading}
                isMain={true}
              />
              {renderRandomTextAnimations(5)}
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default Main;
