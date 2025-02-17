import React, { useState } from 'react';

const ContextMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleRightClick = (event) => {
    event.preventDefault();
    setPosition({ x: event.clientX, y: event.clientY });
    setIsOpen(true);
  };

  const handleCloseMenu = () => {
    setIsOpen(false);
  };

  const handleAction = (action) => {
    alert(`You clicked on ${action}`);
    setIsOpen(false);
  };

  return (
    <div onContextMenu={handleRightClick} style={{ height: '100vh', border: '1px solid #ccc' }}>
      <h1>Right-click to open context menu</h1>

      {isOpen && (
        <ul
          style={{
            position: 'absolute',
            top: position.y,
            left: position.x,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
            listStyle: 'none',
            padding: '5px 0',
            margin: '0',
          }}
          onMouseLeave={handleCloseMenu}
        >
          <li
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
            }}
            onClick={() => handleAction('Option 1')}
          >
            Option 1
          </li>
          <li
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
            }}
            onClick={() => handleAction('Option 2')}
          >
            Option 2
          </li>
          <li
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
            }}
            onClick={() => handleAction('Option 3')}
          >
            Option 3
          </li>
        </ul>
      )}
    </div>
  );
};

export default ContextMenu;
