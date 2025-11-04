import { useState } from "react";
import "./App.css";

function Square({ value, onSquareClick, isWinning }) {
  return (
    <button
      className={`square ${value ? "filled" : ""} ${
        isWinning ? "winning" : ""
      } ${value === "X" ? "x" : value === "O" ? "o" : ""}`}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, players, onWin }) {
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;

  function handleClick(i) {
    if (winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);

    const result = calculateWinner(nextSquares);
    if (result?.winner) onWin(result.winner);
  }

  const status = winner
    ? `🏆 Câștigător: ${
        winner === "X" ? players.xName || "Jucător X" : players.oName || "Jucător O"
      }`
    : `👉 Următorul jucător: ${xIsNext ? players.xName : players.oName}`;

  return (
    <>
      <div className="status">{status}</div>
      <div className="board">
        {squares.map((sq, i) => (
          <Square
            key={i}
            value={sq}
            isWinning={winnerInfo?.line?.includes(i)}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [players, setPlayers] = useState({ xName: "", oName: "" });
  const [namesSet, setNamesSet] = useState(false);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleWin(winner) {
    setScore((prev) => ({
      ...prev,
      [winner]: prev[winner] + 1,
    }));
  }

  function jumpTo(move) {
    setCurrentMove(move);
  }

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const moves = history.map((squares, move) => {
    const description = move ? `Mutarea #${move}` : "Începe jocul";
    return (
      <li key={move}>
        <button
          className={`history-btn ${move === currentMove ? "active" : ""}`}
          onClick={() => jumpTo(move)}
        >
          {description}
        </button>
      </li>
    );
  });

  if (!namesSet) {
    return (
      <div className="name-form">
        <h1>🎮 Joc X și O</h1>
        <input
          type="text"
          placeholder="Nume Jucător X"
          value={players.xName}
          onChange={(e) =>
            setPlayers((prev) => ({ ...prev, xName: e.target.value }))
          }
        />
        <input
          type="text"
          placeholder="Nume Jucător O"
          value={players.oName}
          onChange={(e) =>
            setPlayers((prev) => ({ ...prev, oName: e.target.value }))
          }
        />
        <button
          onClick={() => {
            if (players.xName && players.oName) setNamesSet(true);
          }}
        >
          Începe jocul ▶️
        </button>
      </div>
    );
  }

  return (
    <div className="game">
      <h1 className="title">❌  și  ⭕

</h1>
      <div className="scoreboard">
        <div className="score-item">
          <span className="player-name">{players.xName || "Jucător X"}</span>
          <span className="score-value">{score.X}</span>
        </div>
        <div className="score-item">
          <span className="player-name">{players.oName || "Jucător O"}</span>
          <span className="score-value">{score.O}</span>
        </div>
      </div>

      <div className="game-container">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          players={players}
          onWin={handleWin}
        />
        <div className="game-info">
          <h2>Istoric mutări</h2>
          <ol>{moves}</ol>
          <button className="reset-btn" onClick={resetGame}>
            🔄 Reset joc
          </button>
        </div>
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
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
