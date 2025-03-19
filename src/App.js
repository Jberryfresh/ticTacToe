import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack'

function Square({ value, onSquareClick }) {
  return (
    <Button style={{ fontSize: '48px', padding: '0px', height: '100px', width: '100px' }} variant='outline-success' onClick={onSquareClick}>
      {value}
    </Button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <Row sm={1} className="status justify-content-center">{status}</Row>
      <Stack direction='horizontal' gap={1} style={{ height: '100px', width: '320px' }}>
         <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
         <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
         <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
       </Stack>    
       <Stack direction='horizontal' gap={1} style={{ height: '100px', width: '320px' }}>
         <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
         <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
         <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
       </Stack>
       <Stack direction='horizontal' gap={1} style={{ height: '100px', width: '320px' }}>
         <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
         <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
         <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </Stack>
    </>
  ); 
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
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

  const moves = history.map((_squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {                                                                        
      description = 'Go to game start';
    }
    return (
      <div key={move}>
        <Button variant='outline-success' onClick={() => jumpTo(move)}>{description}</Button>
      </div>
    );
  });

  return (
    <Container fluid="sm" className="d-flex flex-column align-items-center justify-content-center vh-100">
      <Row className="w-100">
        <Col className="d-flex justify-content-center">
          <div className='text-center'>
            <h1>Tic Tac Toe</h1>
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
          </div>
        </Col>
        <Col className="d-flex flex-column align-items-center">
          <div className="game-info">
            <ol>{moves}</ol>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

