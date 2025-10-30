
import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step = 1, unit, onChange, disabled = false }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={label} className="font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">
          {value} {unit}
        </span>
      </div>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                   [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:w-5
                   [&::-webkit-slider-thumb]:h-5
                   [&::-webkit-slider-thumb]:bg-indigo-600
                   [&::-webkit-slider-thumb]:rounded-full
                   [&::-webkit-slider-thumb]:cursor-pointer
                   [&::-moz-range-thumb]:w-5
                   [&::-moz-range-thumb]:h-5
                   [&::-moz-range-thumb]:bg-indigo-600
                   [&::-moz-range-thumb]:rounded-full
                   [&::-moz-range-thumb]:cursor-pointer"
      />
    </div>
  );
};

export default Slider;
