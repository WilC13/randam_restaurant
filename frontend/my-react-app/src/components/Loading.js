import { useState, useEffect } from "react";

import a from "../assets/img/a.png";
import b from "../assets/img/b.png";

function Loading() {
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
    <div className="loading">
      <img
        src={currentImage}
        alt="Loading"
        style={{ width: "auto", height: "100vh" }}
      />
    </div>
  );
}

export default Loading;
