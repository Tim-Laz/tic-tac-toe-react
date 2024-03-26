import { useState } from "react";

function Square({ value, onSquareClick, winner }) {
  return (
    <button className={`square ${winner}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.winner;
  } else if (!winner && squares.includes(null)) {
    status = "Next player: " + (xIsNext ? "X" : "O");
  } else {
    status = "Draw";
  }

  const rows = 3;
  const columns = 3;
  const board = [];

  function renderBoard(winnerLine) {
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) {
        row.push(
          <Square
            value={squares[i * columns + j]}
            onSquareClick={() => handleClick(i * columns + j)}
            winner={winnerLine?.includes(i * columns + j) ? "winner" : ""}
          />
        );
      }
      board.push(<div className="board-row">{row}</div>);
    }
  }

  renderBoard(winner?.line);

  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sort, setSort] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const movesAsc = history.map((squares, move) => {
    let description;
    if (move === history.length - 1) {
      return <li key={move}>{`You are at #move ${move}`}</li>;
    }
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const movesDesc = movesAsc.toReversed();

  function handleSort() {
    setSort(!sort);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{sort ? movesDesc : movesAsc}</ol>
      </div>
      <div className="game-sort">
        <button className="sort-button" onClick={handleSort}>
          Sort
        </button>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const result = { winner: squares[a], line: lines[i] };
      return result;
    }
  }
  return null;
}
