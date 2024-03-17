import "./App.css";
import Btn from "./Btn";
import MyMap from "./MyMap";
import { useState } from "react";

function App() {
  const [showMap, setShowMap] = useState(false);
  return (
    <div className="App">
      <Btn />
      <button
        onClick={() => {
          setShowMap(!showMap);
        }}
      >
        click
      </button>
      {showMap && <MyMap />}
    </div>
  );
}

export default App;
