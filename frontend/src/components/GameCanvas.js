import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const GameCanvas = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const BUBBLE_RADIUS = 20;
  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
  
  const gameState = useRef({
    bubbles: [],
    shooter: { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50, angle: 0 },
    currentBubble: null,
    nextBubble: null,
    shooting: false,
    shotBubble: null,
    animationId: null,
    shootFromLeft: true
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    initGame();
    gameLoop();
    
    function initGame() {
      gameState.current.bubbles = [];
      // Create initial bubble grid
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 15; col++) {
          if (row < 5) { // Only fill first 5 rows initially
            const x = col * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS + (row % 2 ? BUBBLE_RADIUS : 0);
            const y = row * (BUBBLE_RADIUS * 1.7) + BUBBLE_RADIUS;
            gameState.current.bubbles.push({
              x, y, 
              color: COLORS[Math.floor(Math.random() * COLORS.length)],
              row, col
            });
          }
        }
      }
      gameState.current.currentBubble = createNewBubble();
      gameState.current.nextBubble = createNewBubble();
      gameState.current.shooting = false;
    }
    
    function createNewBubble() {
      return {
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      };
    }
    
    function gameLoop() {
      update();
      draw();
      if (!gameOver) {
        gameState.current.animationId = requestAnimationFrame(gameLoop);
      }
    }
    
    function update() {
      if (gameState.current.shotBubble && gameState.current.shotBubble.x !== undefined && gameState.current.shotBubble.y !== undefined) {
        gameState.current.shotBubble.x += gameState.current.shotBubble.vx;
        gameState.current.shotBubble.y += gameState.current.shotBubble.vy;
        
        // Wall collision
        if (gameState.current.shotBubble.x <= BUBBLE_RADIUS || 
            gameState.current.shotBubble.x >= CANVAS_WIDTH - BUBBLE_RADIUS) {
          gameState.current.shotBubble.vx *= -1;
        }
        
        // Check collision with existing bubbles or top wall
        const collision = checkCollision();
        if (collision || gameState.current.shotBubble.y <= BUBBLE_RADIUS) {
          attachBubble();
          return;
        }
        
        // Check if bubble fell off screen
        if (gameState.current.shotBubble.y > CANVAS_HEIGHT) {
          gameState.current.shotBubble = null;
          gameState.current.shooting = false;
          nextTurn();
        }
      }
    }
    
    function checkCollision() {
      if (!gameState.current.shotBubble || 
          gameState.current.shotBubble.x === undefined || 
          gameState.current.shotBubble.y === undefined) {
        return false;
      }
      
      for (let bubble of gameState.current.bubbles) {
        if (bubble && bubble.x !== undefined && bubble.y !== undefined) {
          const dx = bubble.x - gameState.current.shotBubble.x;
          const dy = bubble.y - gameState.current.shotBubble.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < BUBBLE_RADIUS * 2) {
            return bubble;
          }
        }
      }
      return false;
    }
    
    function attachBubble() {
      const shot = gameState.current.shotBubble;
      if (!shot || shot.x === undefined || shot.y === undefined) {
        gameState.current.shotBubble = null;
        gameState.current.shooting = false;
        nextTurn();
        return;
      }
      
      // Find the collision bubble or attach to top
      const collision = checkCollision();
      let newBubble;
      
      if (collision) {
        // Find empty spot near collision bubble
        const attachPos = findAttachPosition(collision, shot);
        newBubble = { 
          x: attachPos.x, 
          y: attachPos.y, 
          color: shot.color, 
          row: attachPos.row, 
          col: attachPos.col 
        };
      } else {
        // Attach to top row
        const row = 0;
        const col = Math.round((shot.x - BUBBLE_RADIUS) / (BUBBLE_RADIUS * 2));
        const x = col * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS;
        const y = BUBBLE_RADIUS;
        newBubble = { x, y, color: shot.color, row, col };
      }
      
      gameState.current.bubbles.push(newBubble);
      
      // Check for matches (3+ same color connected)
      const matches = findMatches(newBubble);
      if (matches.length >= 3) {
        removeBubbles(matches);
        setScore(prev => prev + matches.length * 10);
        removeFloatingBubbles();
      }
      
      gameState.current.shotBubble = null;
      gameState.current.shooting = false;
      nextTurn();
      
      // Check win/lose conditions
      if (gameState.current.bubbles.length === 0) {
        setGameOver(true);
      } else {
        const maxY = Math.max(...gameState.current.bubbles.map(b => b.y || 0));
        if (maxY > CANVAS_HEIGHT - 100) {
          setGameOver(true);
        }
      }
    }
    
    function findAttachPosition(collisionBubble, shot) {
      const neighbors = [
        { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: 0, dc: -1 }, 
        { dr: 0, dc: 1 }, { dr: 1, dc: -1 }, { dr: 1, dc: 0 }
      ];
      
      // Adjust for hexagonal grid
      const offsets = collisionBubble.row % 2 === 0 ? 
        [[-1,-1], [-1,0], [0,-1], [0,1], [1,-1], [1,0]] :
        [[-1,0], [-1,1], [0,-1], [0,1], [1,0], [1,1]];
      
      let bestPos = null;
      let minDist = Infinity;
      
      for (let [dr, dc] of offsets) {
        const newRow = collisionBubble.row + dr;
        const newCol = collisionBubble.col + dc;
        
        if (newRow < 0) continue;
        
        // Check if position is empty
        const occupied = gameState.current.bubbles.find(b => b.row === newRow && b.col === newCol);
        if (occupied) continue;
        
        const x = newCol * (BUBBLE_RADIUS * 2) + BUBBLE_RADIUS + (newRow % 2 ? BUBBLE_RADIUS : 0);
        const y = newRow * (BUBBLE_RADIUS * 1.7) + BUBBLE_RADIUS;
        
        const dist = Math.sqrt((x - shot.x) ** 2 + (y - shot.y) ** 2);
        if (dist < minDist) {
          minDist = dist;
          bestPos = { x, y, row: newRow, col: newCol };
        }
      }
      
      return bestPos || { 
        x: collisionBubble.x, 
        y: collisionBubble.y - BUBBLE_RADIUS * 2, 
        row: Math.max(0, collisionBubble.row - 1), 
        col: collisionBubble.col 
      };
    }
    
    function nextTurn() {
      if (gameState.current.nextBubble) {
        gameState.current.currentBubble = gameState.current.nextBubble;
      } else {
        gameState.current.currentBubble = createNewBubble();
      }
      gameState.current.nextBubble = createNewBubble();
      
      // Alternate shooter position
      gameState.current.shootFromLeft = !gameState.current.shootFromLeft;
      gameState.current.shooter.x = gameState.current.shootFromLeft ? 
        CANVAS_WIDTH * 0.25 : CANVAS_WIDTH * 0.75;
    }
    
    function removeFloatingBubbles() {
      const connected = new Set();
      const queue = [];
      
      // Find all bubbles connected to top row
      gameState.current.bubbles.forEach(bubble => {
        if (bubble.row === 0) {
          queue.push(bubble);
          connected.add(`${bubble.row}-${bubble.col}`);
        }
      });
      
      // BFS to find all connected bubbles
      while (queue.length > 0) {
        const current = queue.shift();
        const neighbors = getNeighbors(current);
        
        neighbors.forEach(neighbor => {
          const key = `${neighbor.row}-${neighbor.col}`;
          if (!connected.has(key)) {
            connected.add(key);
            queue.push(neighbor);
          }
        });
      }
      
      // Remove floating bubbles
      const floating = gameState.current.bubbles.filter(
        bubble => !connected.has(`${bubble.row}-${bubble.col}`)
      );
      
      if (floating.length > 0) {
        gameState.current.bubbles = gameState.current.bubbles.filter(
          bubble => connected.has(`${bubble.row}-${bubble.col}`)
        );
        setScore(prev => prev + floating.length * 5);
      }
    }
    
    function findMatches(bubble) {
      const matches = [];
      const visited = new Set();
      const queue = [bubble];
      
      while (queue.length > 0) {
        const current = queue.shift();
        const key = `${current.row}-${current.col}`;
        
        if (visited.has(key)) continue;
        visited.add(key);
        matches.push(current);
        
        const neighbors = getNeighbors(current);
        for (let neighbor of neighbors) {
          const neighborKey = `${neighbor.row}-${neighbor.col}`;
          if (neighbor.color === bubble.color && !visited.has(neighborKey)) {
            queue.push(neighbor);
          }
        }
      }
      
      return matches;
    }
    
    function getNeighbors(bubble) {
      const neighbors = [];
      const { row, col } = bubble;
      
      // Define neighbor offsets for hexagonal grid
      const offsets = row % 2 === 0 ? 
        [[-1,-1], [-1,0], [0,-1], [0,1], [1,-1], [1,0]] :
        [[-1,0], [-1,1], [0,-1], [0,1], [1,0], [1,1]];
      
      for (let [dr, dc] of offsets) {
        const newRow = row + dr;
        const newCol = col + dc;
        
        const neighbor = gameState.current.bubbles.find(b => b.row === newRow && b.col === newCol);
        if (neighbor) neighbors.push(neighbor);
      }
      
      return neighbors;
    }
    
    function removeBubbles(bubblesToRemove) {
      gameState.current.bubbles = gameState.current.bubbles.filter(
        bubble => !bubblesToRemove.includes(bubble)
      );
    }
    
    function draw() {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Draw bubbles
      gameState.current.bubbles.forEach(bubble => {
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = bubble.color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
      
      // Draw shooter
      const shooter = gameState.current.shooter;
      ctx.save();
      ctx.translate(shooter.x, shooter.y);
      ctx.rotate(shooter.angle);
      ctx.fillStyle = '#666';
      ctx.fillRect(-8, -25, 16, 50);
      
      // Draw shooter direction indicator
      ctx.fillStyle = '#999';
      ctx.fillRect(-2, -35, 4, 10);
      ctx.restore();
      
      // Draw current bubble
      if (gameState.current.currentBubble) {
        ctx.beginPath();
        ctx.arc(shooter.x, shooter.y - 40, BUBBLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = gameState.current.currentBubble.color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw next bubble preview
      if (gameState.current.nextBubble) {
        const nextX = gameState.current.shootFromLeft ? shooter.x + 60 : shooter.x - 60;
        ctx.beginPath();
        ctx.arc(nextX, shooter.y - 20, BUBBLE_RADIUS * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = gameState.current.nextBubble.color;
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Next label
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Next', nextX, shooter.y + 10);
      }
      
      // Draw shot bubble
      if (gameState.current.shotBubble && 
          gameState.current.shotBubble.x !== undefined && 
          gameState.current.shotBubble.y !== undefined) {
        ctx.beginPath();
        ctx.arc(gameState.current.shotBubble.x, gameState.current.shotBubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = gameState.current.shotBubble.color || '#FF6B6B';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
    
    function handlePointerMove(e) {
      if (gameState.current.shooting) return;
      
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
      
      if (!clientX || !clientY) return;
      
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;
      
      const shooter = gameState.current.shooter;
      gameState.current.shooter.angle = Math.atan2(mouseY - shooter.y, mouseX - shooter.x) - Math.PI / 2;
    }
    
    function handlePointerDown(e) {
      e.preventDefault();
      if (!gameState.current.shooting && gameState.current.currentBubble) {
        const shooter = gameState.current.shooter;
        const speed = 10;
        
        gameState.current.shotBubble = {
          x: shooter.x,
          y: shooter.y - 40,
          vx: Math.sin(shooter.angle) * speed,
          vy: -Math.cos(shooter.angle) * speed,
          color: gameState.current.currentBubble.color
        };
        
        gameState.current.shooting = true;
      }
    }
    
    // Mouse events
    canvas.addEventListener('mousemove', handlePointerMove);
    canvas.addEventListener('mousedown', handlePointerDown);
    
    // Touch events
    canvas.addEventListener('touchmove', handlePointerMove, { passive: false });
    canvas.addEventListener('touchstart', handlePointerDown, { passive: false });
    
    return () => {
      if (gameState.current.animationId) {
        cancelAnimationFrame(gameState.current.animationId);
      }
      canvas.removeEventListener('mousemove', handlePointerMove);
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('touchmove', handlePointerMove);
      canvas.removeEventListener('touchstart', handlePointerDown);
    };
  }, [gameOver]);
  
  const submitScore = async () => {
    try {
      const playerName = prompt('Enter your name for the leaderboard:') || 'Anonymous';
      await axios.post('http://localhost:5000/api/scores/add', {
        score,
        level: 1,
        playerName
      });
      alert('Score submitted successfully!');
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const resetGame = () => {
    setScore(0);
    setGameOver(false);
    if (gameState.current.animationId) {
      cancelAnimationFrame(gameState.current.animationId);
    }
    gameState.current.bubbles = [];
    gameState.current.shotBubble = null;
    gameState.current.shooting = false;
    gameState.current.shootFromLeft = true;
    gameState.current.shooter.x = CANVAS_WIDTH / 2;
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Bubble Shooter</h1>
        <div className="score">Score: {score}</div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas"
      />
      
      {gameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Final Score: {score}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={submitScore}>Submit Score</button>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
      
      <div className="instructions">
        <p>Move mouse to aim, click to shoot!</p>
        <p>Match 3+ bubbles of the same color to pop them.</p>
      </div>
    </div>
  );
};

export default GameCanvas;