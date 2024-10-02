"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import the Image component
import { useClientOnly } from "@/hooks/ClientOnly";

import cover from "../../public/images/cover.png";
import title from "../../public/images/title.png";

function RandomBtn({
  setCurrentLocation,
  currentLocation,
  setIsLoading,
  isMain,
}) {
  const [isClicked, setIsClicked] = useState(false);
  const router = useRouter();
  const isClient = useClientOnly();

  const getGeolocation = useCallback(() => {
    if (isClicked) return;
    setIsClicked(true);
    setIsLoading(true);
    // router.push("/loading");

    setTimeout(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
            console.log("Current location: ", currentLocation);
            // setIsLoading(false);
            setIsClicked(false);
          },
          (err) => {
            alert(err.message);
            setIsLoading(false);
            setIsClicked(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        alert("Geolocation is not supported by your browser");
        setIsLoading(false);
        setIsClicked(false);
      }
    }, 500);
  }, [isClicked, router, setCurrentLocation, setIsLoading]);

  useEffect(() => {
    if (!isClient) return;

    // Add event listener for client-side execution
    if (isMain) {
      const button = document.querySelector(".random-btn");
      if (button) {
        button.addEventListener("click", getGeolocation);
      }

      return () => {
        if (button) {
          button.removeEventListener("click", getGeolocation);
        }
      };
    }
  }, [isMain, getGeolocation, isClient]);

  return isMain ? (
    <div className="random-btn">
      <Image src={title} alt="Title" className="title" />
      <Image src={cover} alt="Random" className="random-image" />
    </div>
  ) : (
    <button
      type="button"
      className="btn btn-outline-primary"
      style={{ display: "flex", alignItems: "center" }}
      onClick={getGeolocation}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="currentColor"
        className="bi bi-radar"
        viewBox="0 0 16 16"
        style={{ marginRight: "0.2rem" }}
      >
        <path d="M6.634 1.135A7 7 0 0 1 15 8a.5.5 0 0 1-1 0 6 6 0 1 0-6.5 5.98v-1.005A5 5 0 1 1 13 8a.5.5 0 0 1-1 0 4 4 0 1 0-4.5 3.969v-1.011A2.999 2.999 0 1 1 11 8a.5.5 0 0 1-1 0 2 2 0 1 0-2.5 1.936v-1.07a1 1 0 1 1 1 0V15.5a.5.5 0 0 1-1 0v-.518a7 7 0 0 1-.866-13.847"></path>
      </svg>
      <i>搵過間</i>
    </button>
  );
}

export default RandomBtn;
