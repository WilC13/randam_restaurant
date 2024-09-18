import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import a from "../assets/img/a2.png";
import b from "../assets/img/b2.png";

function Loading({ className }) {
  const [currentImage, setCurrentImage] = useState(a);
  const [dots, setDots] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const images = [a, b];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setCurrentImage(images[currentIndex]);
    }, 300); // 每0.3切換一次圖片

    const dotsInterval = setInterval(() => {
      setDots((prevDots) => (prevDots.length < 3 ? prevDots + "・" : ""));
    }, 300); // 每0.3秒增加一個點

    const timeout = setTimeout(() => {
      navigate("/info");
    }, 10000); // 10秒後導航到/info頁面

    return () => {
      clearInterval(interval);
      clearInterval(dotsInterval);
      clearTimeout(timeout);
    }; // 清除定時器
  }, [navigate]);

  return (
    <div className={className}>
      <h1>搵食啫{dots}</h1>
      <img src={currentImage} alt="Loading" />
    </div>
  );
}

export default Loading;
