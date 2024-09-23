import React, { useEffect, useState } from "react";
import "../assets/styles/RandomTextAnimation.css";
import { textList } from "../services/randomWord";

const colors = ["#181C14", "#3C3D37", "31304D", "2B2A4C"];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  return colors[getRandomInt(0, colors.length - 1)];
}

function getRandomLetterSpacing() {
  return `${Math.random() * 0.5}em`;
}

function getRandomOpacity(min = 0.1, max = 0.8) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function createKeyframes(opacity, animationName) {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  const keyframes = `
    @keyframes ${animationName} {
      0% {
        opacity: 0;
      }
      10% {
        opacity: ${opacity};
      }
      90% {
        opacity: ${opacity};
      }
      100% {
        opacity: 0;
      }
    }
  `;
  styleSheet.innerHTML = keyframes;
  document.head.appendChild(styleSheet);
}

function isOverlapping(newElement, existingElements, buffer = 10) {
  const newRect = newElement.getBoundingClientRect();
  return existingElements.some((el) => {
    const rect = el.getBoundingClientRect();
    return !(
      newRect.right + buffer < rect.left ||
      newRect.left - buffer > rect.right ||
      newRect.bottom + buffer < rect.top ||
      newRect.top - buffer > rect.bottom
    );
  });
}

function createRandomTextElement(text, isMobile, existingElements) {
  let top, left, newElement;
  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

  const isVertical = Math.random() < 0.5;
  const color = getRandomColor();
  const letterSpacing = getRandomLetterSpacing();
  const opacity = getRandomOpacity();
  const animationName = `fadeInOut-${Math.random().toString(36).substr(2, 9)}`;

  createKeyframes(opacity, animationName);

  newElement = document.createElement("div");
  newElement.textContent = text;
  newElement.style.opacity = opacity;
  newElement.style.position = "absolute";
  newElement.style.fontSize = "1rem";
  newElement.style.fontFamily = "'ZCOOL QingKe HuangYou', sans-serif";
  newElement.style.fontWeight = 300;
  newElement.style.color = color;
  newElement.style.letterSpacing = letterSpacing;
  newElement.style.animation = `${animationName} 3s ease-in-out forwards`;

  // Randomly decide whether to display text horizontally or vertically
  newElement.style.writingMode = isVertical ? "vertical-rl" : "horizontal-tb";

  if (isVertical) {
    newElement.style.transform = "rotate(180deg)"; // Adjust for vertical-rl writing mode
  }

  document.body.appendChild(newElement);

  do {
    const isTop = Math.random() < 0.5;
    top = `${getRandomInt(
      isTop ? 5 : 70,
      isTop ? (isMobile ? 20 : 30) : 95
    )}vh`;
    left = `${getRandomInt(5, 90)}vw`;

    newElement.style.top = top;
    newElement.style.left = left;

    // Ensure position within viewport
    const newRect = newElement.getBoundingClientRect();
    if (newRect.right > containerWidth) {
      left = `${containerWidth - newRect.width}px`;
    }
    if (newRect.bottom > containerHeight) {
      top = `${containerHeight - newRect.height}px`;
    }
    newElement.style.top = top;
    newElement.style.left = left;
  } while (isOverlapping(newElement, existingElements));

  document.body.removeChild(newElement);

  const style = {
    top,
    left,
    fontFamily: "'ZCOOL QingKe HuangYou', sans-serif",
    fontWeight: 300,
    color,
    letterSpacing,
    writingMode: isVertical ? "vertical-rl" : "horizontal-tb",
    opacity,
    animation: `${animationName} 3s ease-in-out forwards`,
  };

  return { text, style };
}

const RandomTextAnimation = () => {
  const [randomTexts, setRandomTexts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const showRandomText = () => {
      const numElements = getRandomInt(2, isMobile ? 3 : 5);
      // const numElements = 10;
      const newRandomTexts = [];
      const existingElements = Array.from(
        document.querySelectorAll(".random-text, img")
      );
      for (let i = 0; i < numElements; i++) {
        const randomIndex = getRandomInt(0, textList.length - 1);
        const randomText = textList[randomIndex];
        newRandomTexts.push(
          createRandomTextElement(randomText, isMobile, existingElements)
        );
      }
      setRandomTexts(newRandomTexts);

      setTimeout(() => {
        setRandomTexts([]);
      }, 3000); // 3秒後移除元素
    };

    showRandomText();

    const interval = Math.random() * (8000 - 3000) + 3000;
    const intervalId = setInterval(showRandomText, interval);

    return () => clearInterval(intervalId);
  }, [isMobile]);

  return (
    <div id="text-container">
      {randomTexts.map((item, index) => (
        <div key={index} className="random-text" style={item.style}>
          {item.text}
        </div>
      ))}
    </div>
  );
};

export default RandomTextAnimation;
