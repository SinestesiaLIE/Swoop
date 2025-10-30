import React from 'react';

interface CircleProps {
  duration: number;
  radiusPercent: number;
  screenWidth: number;
  onAnimationEnd: () => void;
  playState: 'running' | 'paused';
}

const Circle: React.FC<CircleProps> = ({ duration, radiusPercent, screenWidth, onAnimationEnd, playState }) => {
  const diameter = (screenWidth * radiusPercent) / 100;

  const keyframes = `
    @keyframes moveCircle {
      from {
        transform: translateX(-${diameter}px) translateY(-50%);
      }
      to {
        transform: translateX(${screenWidth}px) translateY(-50%);
      }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div
        className="absolute bg-black rounded-full"
        style={{
          width: `${diameter}px`,
          height: `${diameter}px`,
          top: '50%',
          left: 0,
          // Establece la posición inicial para evitar un parpadeo antes de que comience la animación
          transform: `translateX(-${diameter}px) translateY(-50%)`,
          animationName: 'moveCircle',
          animationDuration: `${duration.toFixed(3)}s`,
          animationTimingFunction: 'linear',
          animationFillMode: 'forwards', // Mantiene el estado final de la animación
          animationPlayState: playState,
        }}
        onAnimationEnd={onAnimationEnd}
      />
    </>
  );
};

export default Circle;
