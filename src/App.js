import { useEffect, useState, useRef } from "react";
import "./App.css";

const array50 = [...new Array(40).keys()];
let cells = array50.map((_r) => array50.map((_c) => 0));

cells[1][1] = 1;
cells[1][2] = 1;
cells[1][3] = 1;

cells = nextGen(cells);
export default function App() {
  const [running, setRunning] = useState(false);
  const interval = useRef(null);
  const [gen, setGen] = useState(0);
  const [, setId] = useState(0);

  function startRunning() {
    setRunning(true);
    interval.current = setInterval(() => {
      cells = nextGen(cells);
      setGen((g) => g + 1);
    }, 500);
  }

  function stopRunning() {
    setRunning(false);
    clearInterval(interval.current);
  }

  function clearCells() {
    cells = array50.map((_r) => array50.map((_c) => 0));
    setId((id) => id + 1);
  }

  useEffect(() => {
    startRunning();
    return () => {
      stopRunning();
    };
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div>
        {cells.map((row, rn) => (
          <div key={rn} style={{ display: "flex" }}>
            {row.map((val, cn) => (
              <div
                key={cn}
                style={{
                  height: "20px",
                  width: "20px",
                  border: "1px solid black",
                  backgroundColor: val === 1 ? "black" : "white",
                }}
                onClick={() => {
                  if (!running) {
                    cells[rn][cn] = cells[rn][cn] === 1 ? 0 : 1;
                    setGen(0);
                    setId((id) => id + 1);
                  }
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginLeft: "50px" }}>
        <h2>{gen}</h2>
        {running ? (
          <button onClick={stopRunning}>Stop</button>
        ) : (
          <>
            <button onClick={startRunning}>Start</button>
            <button onClick={clearCells}>Clear</button>
          </>
        )}
      </div>
    </div>
  );
}

function nextGen(cells) {
  return cells.map((row, rn) =>
    row.map((val, cn) => {
      if (val === 1) return liveCheck(cells, [rn, cn]);
      else return deadCheck(cells, [rn, cn]);
    })
  );
}

function liveCheck(cells, [r, c]) {
  const neighbours = countNeighbours(cells, [r, c]);

  return [2, 3].includes(neighbours) ? 1 : 0;
}

function deadCheck(cells, [r, c]) {
  const neighbours = countNeighbours(cells, [r, c]);
  return [3].includes(neighbours) ? 1 : 0;
}

function countNeighbours(cells, [r, c]) {
  const neighbourPos = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];

  const neighbourCount = neighbourPos.reduce((t, [nr, nc]) => {
    return t + (cells[r + nr]?.[c + nc] === 1 ? 1 : 0);
  }, 0);

  // console.log(neighbourCount, `[${r} ${c}]`, cells[r + 1]?.[c - 1]);
  return neighbourCount;
}
