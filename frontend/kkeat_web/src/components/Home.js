"use client";

import { useState } from "react";

import RandomBtn from "./RandomBtn";
import RandomTextAnimation from "./RandomTextAnimation";

import styles from "./Home.module.css";
import "@/styles/App.css";
import "@/styles/index.css";
import "@/styles/info.css";
import "@/styles/RandomTextAnimation.css";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState({});
  const [loadingStartTime, setLoadingStartTime] = useState(null);

  return (
    // <div className={`${styles.container} font-sans`}>
    <div>
      <div className={styles.randomBtn}>
        <RandomBtn
          setCurrentLocation={setCurrentLocation}
          currentLocation={currentLocation}
          setIsLoading={setIsLoading}
          isMain={true}
        />
      </div>
      <RandomTextAnimation />
    </div>
  );
};

export default Home;
