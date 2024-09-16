import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import RandomBtn from "./RandomBtn";
import MapBtn from "./MapBtn";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const price = { 0: "超平", 1: "平", 2: "中等", 3: "貴", 4: "超貴" };

function Info({ info, setCurrentLocation, setIsLoading, currentLocation }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!info || Object.keys(info).length === 0) {
      navigate("/");
    }
  }, [info, navigate]);

  if (!info || Object.keys(info).length === 0) {
    return null;
  }

  return (
    <div>
      <h2>{info.name}</h2>
      <p>Address: {info.vicinity}</p>
      <img
        src={`${API_BASE_URL}/photo?photo_reference=${info.photos[0].photo_reference}&place_id=${info.place_id}`}
        alt={info.name}
        // style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain' }}
        style={{ maxWidth: "33vm", maxHeight: "33vh", objectFit: "contain" }}
      />
      <p>Rating: {info.rating}</p>
      <p>Price Level: {price[info.price_level]}</p>
      <RandomBtn
        setCurrentLocation={setCurrentLocation}
        setIsLoading={setIsLoading}
      />
      {currentLocation && <MapBtn location={currentLocation} data={info} />}
    </div>
  );
}

export default Info;
