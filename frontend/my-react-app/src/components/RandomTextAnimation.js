import React, { useEffect, useState } from "react";
import "../assets/styles/RandomTextAnimation.css";

const textList = [
  "是但啦",
  "算數啦",
  "唔煩你喇",
  "求其啦",
  "餓死喇",
  "人生苦短",
  "無啖好食",
  "犯法牙",
  "填飽個肚",
  "食花生",
  "廢水",
  "自肥",
  "不想努力了",
  "唔想諗",
  "Whatever la",
  "Si L Dan La",
  "OJ",
];

const colors = ["#181C14", "#3C3D37", "31304D", "2B2A4C"];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  return colors[getRandomInt(0, colors.length - 1)];
}

function getRandomLetterSpacing() {
  return `${getRandomInt(0, 10)}px`;
}

function isOverlapping(newElement, existingElements, buffer = 10) {
  const newRect = newElement.getBoundingClientRect();
  return existingElements.some((el) => {
    const rect = el.getBoundingClientRect();
    return !(
      newRect.right + buffer < rect.left ||
      newRect.left > rect.right + buffer ||
      newRect.bottom + buffer < rect.top ||
      newRect.top > rect.bottom + buffer
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

  newElement = document.createElement("div");
  newElement.style.position = "absolute";
  newElement.style.fontSize = "1rem";
  newElement.style.fontFamily = "'ZCOOL QingKe HuangYou', sans-serif";
  newElement.style.fontWeight = 300;
  newElement.style.color = color;
  newElement.style.letterSpacing = letterSpacing;
  newElement.textContent = text;

  // Randomly decide whether to display text horizontally or vertically
  newElement.style.writingMode = isVertical ? "vertical-rl" : "horizontal-tb";

  if (isVertical) {
    newElement.style.transform = "rotate(180deg)"; // Adjust for vertical-rl writing mode
  }

  document.body.appendChild(newElement);

  do {
    const isTop = Math.random() < 0.5;
    top = `${getRandomInt(5, isTop ? (isMobile ? 20 : 30) : 95)}vh`;
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
      const numElements = getRandomInt(1, isMobile ? 1 : 3);
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
      }, 2000); // 3秒後移除元素
    };

    const intervalId = setInterval(showRandomText, 3000); // 每5秒顯示一次隨機文字
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
