import { useState, useRef } from 'react';

const LayeredButton = ({ onClick, content, clickEffectPath = "/Faqs/ButtonClicks/ClickEffect.svg", size = 49 }) => {
  const [pressed, setPressed] = useState(false);
  const [showClickEffect, setShowClickEffect] = useState(false);
  const clickTimeoutRef = useRef(null);

  const handleMouseDown = (e) => {
    e.stopPropagation();
    setPressed(true);

    clearTimeout(clickTimeoutRef.current);
    setShowClickEffect(true);
    clickTimeoutRef.current = setTimeout(() => {
      setShowClickEffect(false);
    }, 250);
  };

  const handleMouseUp = (e) => {
    e.stopPropagation();
    setPressed(false);
  };

  const handleMouseLeave = () => {
    setPressed(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    onClick && onClick();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      handleClick(e);
    }
  };

  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* click effect */}
      <div style={{ position: 'relative', width: size, height: size }}>
        {showClickEffect && (
          <img
            src={clickEffectPath}
            alt=""
            style={{
              position: 'absolute',
              inset: '0',
              pointerEvents: 'none',
              zIndex: 50,
              transform: 'scale(5)',
              animation: 'comicClickPop 0.35s ease-out',
            }}
          />
        )}

        {/* top layer */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#FFE500',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '7mm',
            outline: '0.25rem solid rgb(0, 0, 0)',
            transition: 'transform 0.12s ease, background 0.2s',
            position: 'relative',
            zIndex: 3,
            cursor: 'pointer',
            overflow: 'hidden',
            transform: pressed ? 'translateY(6px)' : 'none',
            userSelect: 'none',
          }}
        >
          {typeof content === 'string' && content.startsWith('/') ? (
            //img content
            <img
              src={content}
              alt="button-icon"
              style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
            />
          ) : (
            //content
            <span style={{ fontSize: '1.5rem', lineHeight: 1, pointerEvents: 'none', fontWeight: 'bold' }}>
              {content}
            </span>
          )}
        </div>

        {/* middle layer */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: 'black',
            top: 3,
            left: 0,
            borderRadius: '7mm',
            outline: '4px solid rgb(36, 38, 34)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* bottom layer */}
        <div
          style={{
            position: 'absolute',
            width: 'calc(100% + 2px)',
            height: '100%',
            background: 'rgb(140, 140, 140)',
            top: 5,
            left: -1,
            borderRadius: '7mm',
            outline: '2px solid rgb(36, 38, 34)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* click effect animation */}
      <style>
        {`
          @keyframes comicClickPop {
            0% {
              transform: scale(1);
              opacity: 0;
            }
            50% {
              transform: scale(5.3);
              opacity: 1;
            }
            100% {
              transform: scale(5);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default LayeredButton;
