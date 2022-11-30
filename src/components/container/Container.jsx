import React, { useState } from "react";
import Board from "../board/Board";
import './style.css'

const Container = () => {
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState("5");

  const changeColor = (params) => {
    const { value } = params.target;
    setColor(value);
  };

  const changeSize = (params) => {
    const { value } = params.target;
    setSize(value);
  };

  return (
    <div className="container">
      <div className="tools-section">
        <div className="color-picker-container">
          Select Brush Color : &nbsp;
          <input type="color" value={color} onChange={(e) => changeColor(e)} />
        </div>
        <div className="brushsize-container">
          Select Brush Size: &nbsp;
          <select value={size} onChange={(e) => changeSize(e)}>
            <option> 5 </option>
            <option> 10 </option>
            <option> 15 </option>
            <option> 20 </option>
            <option> 25 </option>
            <option> 30 </option>
          </select>
        </div>
      </div>

      <div className="board-container">
        <Board color={color} size={size} />
      </div>
    </div>
  );
};

export default Container;
