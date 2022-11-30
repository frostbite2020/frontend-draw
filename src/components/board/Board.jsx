import React, { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import io from "socket.io-client";
import "./style.css";

const Board = ({ color, size }) => {
  let timeout;

  let socket = io.connect("http://localhost:5000/");

  let ctx;
  let isDrawing = false;

  useEffect(() => {
    socket.on("canvas-data", function (data) {
      console.log("this is data: ", data);
      let _isDrawing = isDrawing;
      let interval = setInterval(function () {
        if (_isDrawing) return;
        _isDrawing = true;
        clearInterval(interval);
        let image = new Image();
        const canvas = document.querySelector("#board");
        ctx = canvas.getContext("2d");
        image.onload = function () {
          ctx.drawImage(image, 0, 0);
          _isDrawing = false;
        };
        image.src = data;
      }, 200);
    });
  }, []);

  const drawOnCanvas = useCallback(() => {
    console.log("this is draw on canvas");
    const canvas = document.querySelector("#board");
    ctx = canvas.getContext("2d");

    const sketch = document.querySelector("#sketch");
    const sketchStyle = getComputedStyle(sketch);
    canvas.width = parseInt(sketchStyle.getPropertyValue("width"));
    canvas.height = parseInt(sketchStyle.getPropertyValue("height"));

    let mouse = { x: 0, y: 0 };
    let lastMouse = { x: 0, y: 0 };

    canvas.addEventListener(
      "mousemove",
      function (e) {
        lastMouse.x = mouse.x;
        lastMouse.y = mouse.y;

        mouse.x = e.pageX - ctx.canvas.offsetLeft;
        mouse.y = e.pageY - ctx.canvas.offsetTop;
      },
      false
    );

    /* Drawing on Paint App */
    ctx.lineWidth = size;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    canvas.addEventListener(
      "mousedown",
      function (_e) {
        canvas.addEventListener("mousemove", onPaint, false);
      },
      false
    );

    canvas.addEventListener(
      "mouseup",
      function () {
        canvas.removeEventListener("mousemove", onPaint, false);
      },
      false
    );

    let _rootTimeout = timeout;
    let _rootSocket = socket;
    const onPaint = () => {
      ctx.beginPath();
      ctx.moveTo(lastMouse.x, lastMouse.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.closePath();
      ctx.stroke();

      if (_rootTimeout !== undefined) clearTimeout(_rootTimeout);
      _rootTimeout = setTimeout(function () {
        var base64ImageData = canvas.toDataURL("image/png");
        _rootSocket.emit("canvas-data", base64ImageData);
      }, 1000);
    };
  }, []);

  useEffect(() => {
    drawOnCanvas();
  }, [drawOnCanvas]);

  return (
    <div className="sketch" id="sketch">
      <canvas className="board" id="board"></canvas>
    </div>
  );
};

export default Board;
