import { useState } from "react";
import { useNavigate } from "react-router-dom";

import photo from "../assets/img/a2.png";

function RandomBtn({ setCurrentLocation, setIsLoading }) {
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
            setIsLoading(false);
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

  return (
    <div>
      <img
        src={photo}
        alt="Random"
        style={{ width: "auto", height: "100vh" }}
        onClick={getGeolocation}
      />
    </div>
  );
}

export default RandomBtn;
