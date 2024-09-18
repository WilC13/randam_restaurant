import { useState } from "react";
import { useNavigate } from "react-router-dom";

import cover from "../assets/img/cover.png";
import title from "../assets/img/title.png";

function RandomBtn({ setCurrentLocation, setIsLoading, isMain }) {
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

  const getGeolocation = () => {
    if (isClicked) return;
    setIsClicked(true);
    setIsLoading(true);
    navigate("/loading");

    setTimeout(() => {
      setIsLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
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
        alert("Geolocation is not supproted by your broswer");
        setIsLoading(false);
        setIsClicked(false);
      }
    }, 500);
  };

  return isMain ? (
    <div className="random-btn" onClick={getGeolocation}>
      <img src={title} alt="Title" className="title" />
      <img src={cover} alt="Random" className="random-image" />
      {/* <img src={click} alt="Click" className="click-image" /> */}
    </div>
  ) : (
    <button
      type="button"
      className="btn btn-outline-primary"
      onClick={getGeolocation}
      style={{ display: "flex", alignItems: "center" }}
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
