import { useState, useEffect } from "react";

import a from "../assets/img/a2.png";
import b from "../assets/img/b2.png";

function Loading({ className }) {
  const [currentImage, setCurrentImage] = useState(a);
  const [dots, setDots] = useState("");

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

    return () => {
      clearInterval(interval);
      clearInterval(dotsInterval);
    }; // 清除定時器
  }, []);

  return (
    <div className={className}>
      <h1>搵食中{dots}</h1>
      <img src={currentImage} alt="Loading" />
    </div>
  );
}

export default Loading;
