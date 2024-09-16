import { useState } from "react";
import { useNavigate } from "react-router-dom";

import title from "../assets/img/title.png";
import photo from "../assets/img/a2.png";
import click from "../assets/img/click.png";

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
    <div className="random-btn">
      <img src={title} alt="Title" className="title" />
      <img src={photo} alt="Random" onClick={getGeolocation} />
      <img src={click} alt="Click" className="click-image" />
    </div>
  );
}

export default RandomBtn;
