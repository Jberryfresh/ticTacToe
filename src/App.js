import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';

function Square({ value, onSquareClick, isWinning }) {
  return (
    <Button 
      style={{ 
        fontSize: '48px', 
        padding: '0px', 
        height: '100px', 
        width: '100px',
        background: isWinning ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'white',
        color: isWinning ? 'white' : (value === 'X' ? '#667eea' : '#f093fb'),
        fontWeight: 'bold',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transform: value ? 'scale(1)' : 'scale(0.95)',
      }} 
      className="square-button"
      onClick={onSquareClick}
      disabled={!!value}
    >
      {value}
    </Button>
  );
}

function Board({ xIsNext, squares, onPlay, winningLine }) {
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

  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo?.winner;
  const isDraw = !winner && squares.every(square => square !== null);
  let status;
  let statusClass = "status";
  
  if (winner) {
    status = "🎉 Winner: " + winner + " 🎉";
    statusClass = "status winner";
  } else if (isDraw) {
    status = "🤝 It's a Draw! 🤝";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <Row sm={1} className={statusClass + " justify-content-center"}>{status}</Row>
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        padding: '20px', 
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
      }}>
        <Stack direction='horizontal' gap={2} style={{ height: '100px', width: '320px', marginBottom: '8px' }}>
           <Square value={squares[0]} onSquareClick={() => handleClick(0)} isWinning={winningLine?.includes(0)} />
           <Square value={squares[1]} onSquareClick={() => handleClick(1)} isWinning={winningLine?.includes(1)} />
           <Square value={squares[2]} onSquareClick={() => handleClick(2)} isWinning={winningLine?.includes(2)} />
         </Stack>    
         <Stack direction='horizontal' gap={2} style={{ height: '100px', width: '320px', marginBottom: '8px' }}>
           <Square value={squares[3]} onSquareClick={() => handleClick(3)} isWinning={winningLine?.includes(3)} />
           <Square value={squares[4]} onSquareClick={() => handleClick(4)} isWinning={winningLine?.includes(4)} />
           <Square value={squares[5]} onSquareClick={() => handleClick(5)} isWinning={winningLine?.includes(5)} />
         </Stack>
         <Stack direction='horizontal' gap={2} style={{ height: '100px', width: '320px' }}>
           <Square value={squares[6]} onSquareClick={() => handleClick(6)} isWinning={winningLine?.includes(6)} />
           <Square value={squares[7]} onSquareClick={() => handleClick(7)} isWinning={winningLine?.includes(7)} />
           <Square value={squares[8]} onSquareClick={() => handleClick(8)} isWinning={winningLine?.includes(8)} />
        </Stack>
      </div>
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

  function resetGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const winnerInfo = calculateWinner(currentSquares);
  const winningLine = winnerInfo?.line;

  const moves = history.map((_squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {                                                                        
      description = 'Go to game start';
    }
    return (
      <div key={move} style={{ marginBottom: '0.5rem' }}>
        <Button 
          variant={move === currentMove ? 'primary' : 'outline-primary'}
          onClick={() => jumpTo(move)}
          style={{
            width: '100%',
            borderRadius: '8px',
            fontWeight: move === currentMove ? 'bold' : 'normal',
          }}
        >
          {description}
        </Button>
      </div>
    );
  });

  return (
    <Container fluid="sm" className="d-flex flex-column align-items-center justify-content-center vh-100">
      <Row className="w-100">
        <Col className="d-flex justify-content-center">
          <div className='text-center'>
            <h1>Tic Tac Toe</h1>
            <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningLine={winningLine} />
            <Button 
              variant="light" 
              size="lg"
              onClick={resetGame}
              style={{
                marginTop: '1.5rem',
                borderRadius: '12px',
                padding: '0.75rem 2rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none',
                color: 'white',
              }}
            >
              🔄 New Game
            </Button>
          </div>
        </Col>
        <Col className="d-flex flex-column align-items-center justify-content-center">
          <div className="game-info">
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>
              Move History <Badge bg="secondary">{history.length - 1}</Badge>
            </h3>
            <div>{moves}</div>
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
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

