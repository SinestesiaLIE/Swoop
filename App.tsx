import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Slider from './components/Slider';
import Circle from './components/Circle';

const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);

const PauseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
);

type AnimationState = 'idle' | 'running' | 'paused';

const App: React.FC = () => {
  const [speed, setSpeed] = useState<number>(75);
  const [radius, setRadius] = useState<number>(10);
  const [physicalScreenWidthCm, setPhysicalScreenWidthCm] = useState<string>('34.4'); // Ancho común de laptop de 15.6"
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [animationScreenWidth, setAnimationScreenWidth] = useState(window.innerWidth);

  const duration = useMemo(() => {
    const speedMs = speed * 1000 / 3600; // Convert km/h to m/s
    const distanceMeters = Number(physicalScreenWidthCm) / 100; // Convert cm to m
    if (speedMs <= 0 || distanceMeters <= 0) return 0;
    return distanceMeters / speedMs;
  }, [speed, physicalScreenWidthCm]);

  const handleStartResume = useCallback(() => {
    if (duration > 0 && (animationState === 'idle' || animationState === 'paused')) {
      if (animationState === 'idle') {
        setAnimationScreenWidth(window.innerWidth);
      }
      setAnimationState('running');
    }
  }, [duration, animationState]);

  const handlePause = useCallback(() => {
    if (animationState === 'running') {
      setAnimationState('paused');
    }
  }, [animationState]);

  const handleAnimationEnd = useCallback(() => {
    setAnimationState('idle');
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && (animationState === 'idle' || animationState === 'paused')) {
        event.preventDefault();
        handleStartResume();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [animationState, handleStartResume]);

  const controlsDisabled = animationState !== 'idle';

  return (
    <main className="w-screen h-screen bg-green-600 overflow-hidden relative font-sans">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-xl w-11/12 max-w-2xl border border-gray-200">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Herramienta calibración Swoop vision.</h1>
          <p className="text-sm text-gray-500 mt-1">
            Simulador de velocidad constante, para calibración de  sistema de visión.
          </p>
          <p className="text-xs text-gray-500 mt-2 p-2 bg-gray-100 rounded-md">
            Distancia de referencia (Ancho Físico): <strong>{Number(physicalScreenWidthCm) > 0 ? `${physicalScreenWidthCm} cm` : 'Inválido'}</strong>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <Slider
            label="Velocidad"
            value={speed}
            min={1}
            max={100}
            unit="km/h"
            onChange={(e) => setSpeed(Number(e.target.value))}
            disabled={controlsDisabled}
          />
          <Slider
            label="Radio del Círculo"
            value={radius}
            min={1}
            max={25}
            unit="% del ancho"
            onChange={(e) => setRadius(Number(e.target.value))}
            disabled={controlsDisabled}
          />
          <div className="md:col-span-2">
            <label htmlFor="physicalWidthInput" className="block font-medium text-gray-700 mb-2">Ancho Físico (cm)</label>
            <input
                id="physicalWidthInput"
                type="number"
                value={physicalScreenWidthCm}
                onChange={(e) => setPhysicalScreenWidthCm(e.target.value)}
                disabled={controlsDisabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-200"
                placeholder="Ancho en centímetros"
            />
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-200 order-2 sm:order-1">
                <p className="text-sm font-medium text-gray-800">
                    Tiempo de recorrido: <strong className="text-lg text-indigo-700">{duration.toFixed(3)}s</strong>
                </p>
            </div>
            <div className="flex space-x-4 order-1 sm:order-2">
                 <button
                    onClick={handleStartResume}
                    disabled={animationState === 'running'}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <PlayIcon className="w-5 h-5 mr-2" />
                    {animationState === 'paused' ? 'Reanudar' : 'Iniciar'}
                  </button>
                  <button
                    onClick={handlePause}
                    disabled={animationState !== 'running'}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <PauseIcon className="w-5 h-5 mr-2" />
                    Detener
                  </button>
            </div>
        </div>
      </div>
      
      {animationState !== 'idle' && (
        <Circle
          duration={duration}
          radiusPercent={radius}
          screenWidth={animationScreenWidth}
          onAnimationEnd={handleAnimationEnd}
          playState={animationState}
        />
      )}
    </main>
  );
};

export default App;
