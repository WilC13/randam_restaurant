import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import RandomBtn from "./RandomBtn";
import MapBtn from "./MapBtn";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import "../assets/styles/Info.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Info({ info, setCurrentLocation, setIsLoading, currentLocation }) {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!info || Object.keys(info).length === 0) {
      navigate("/");
    }
  }, [info, navigate]);

  if (!info || Object.keys(info).length === 0) {
    return null;
  }

  const renderPiggyBanks = (priceLevel) => {
    const piggyBanks = [];
    for (let i = 0; i < priceLevel; i++) {
      piggyBanks.push(
        <i key={i} className="bi bi-piggy-bank" style={{ padding: "2px" }}></i>
      );
    }
    return piggyBanks;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="info-container">
      <div className="info">
        <h2>{info.name}</h2>
        {!imageLoaded && !imageError && (
          <div className="image-placeholder">
            <p>幫緊你幫緊你</p>
          </div>
        )}
        {imageError && (
          <div className="image-error">
            <p>Image failed to load</p>
          </div>
        )}
        <img
          src={`${API_BASE_URL}/photo?photo_reference=${info.photos[0].photo_reference}&place_id=${info.place_id}`}
          alt={info.name}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        <p>地址: {info.vicinity}</p>
        <p>評分: {info.rating}</p>
        <div style={{ color: "#666" }}>
          <p style={{ display: "inline" }}>價錢: </p>
          {renderPiggyBanks(info.price_level + 1)}
        </div>
      </div>
      <div className="info-btn-container">
        <RandomBtn
          setCurrentLocation={setCurrentLocation}
          setIsLoading={setIsLoading}
          isMain={false}
        />

        <MapBtn location={currentLocation} data={info} />
      </div>
    </div>
  );
}

export default Info;
