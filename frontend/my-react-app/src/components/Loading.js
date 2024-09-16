import { useState, useEffect } from "react";

import a from "../assets/img/a2.png";
import b from "../assets/img/b2.png";

function Loading({ className }) {
  const [currentImage, setCurrentImage] = useState(a);

  useEffect(() => {
    const images = [a, b];
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setCurrentImage(images[currentIndex]);
    }, 300); // 每秒切換一次圖片

    return () => clearInterval(interval); // 清除定時器
  }, []);

  return (
    <div className={className}>
      <img src={currentImage} alt="Loading" />
    </div>
  );
}

export default Loading;
