import { useEffect, useState, useRef } from "react";

const GRID_SIZE = 15;
const GAME_GRID = Array.from({ length: GRID_SIZE }, () =>
  Array.from({ length: GRID_SIZE }).fill("")
);

const generateFood = () => {
  return [
    Math.floor(Math.random() * GRID_SIZE),
    Math.floor(Math.random() * GRID_SIZE),
  ];
};

const INITIAL_STATE = [[5, 5]];

export default function SnakeGame() {
  const [snakeBody, setSnakeBody] = useState(INITIAL_STATE);

  const foodRef = useRef(generateFood());

  const directionRef = useRef([1, 0]);

  const isSnakeBody = (xc, yc) => {
    return snakeBody.some(([x, y]) => {
      return x == xc && y == yc;
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSnakeBody((prevBody) => {
        const newHead = [
          prevBody[0][0] + directionRef.current[0],
          prevBody[0][1] + directionRef.current[1],
        ];
        if (
          newHead[0] >= GRID_SIZE ||
          newHead[0] < 0 ||
          newHead[1] >= GRID_SIZE ||
          newHead[1] < 0
        ) {
          return INITIAL_STATE;
        }
        const copiedSnakeBody = prevBody.map((arr) => [...arr]);
        if (
          newHead[0] == foodRef.current[0] &&
          newHead[1] == foodRef.current[1]
        ) {
          foodRef.current = generateFood();
        } else {
          copiedSnakeBody.pop();
        }
        copiedSnakeBody.unshift(newHead);
        return copiedSnakeBody;
      });
    }, 1000);

    const handleKeyEvent = (e) => {
      if (e.key === "ArrowUp" && directionRef.current[1] != 1) {
        directionRef.current = [0, -1];
      }
      if (e.key === "ArrowDown" && directionRef.current[1] != -1) {
        directionRef.current = [0, 1];
      }
      if (e.key === "ArrowLeft" && directionRef.current[0] != 1) {
        directionRef.current = [-1, 0];
      }
      if (e.key === "ArrowRight" && directionRef.current[0] != -1) {
        directionRef.current = [1, 0];
      }
    };

    window.addEventListener("keydown", handleKeyEvent);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("keydown", handleKeyEvent);
    };
  }, []);

  return (
    <div className="container">
      {GAME_GRID.map((row, yc) => {
        return row.map((cell, xc) => {
          return (
            <div
              className={`cell ${isSnakeBody(xc, yc) ? "snake-body" : ""} ${
                yc == foodRef.current[0] && xc == foodRef.current[1]
                  ? "food"
                  : ""
              }`}
            ></div>
          );
        });
      })}
    </div>
  );
}
