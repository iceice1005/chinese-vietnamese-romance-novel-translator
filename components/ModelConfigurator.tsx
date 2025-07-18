
import React, { useState } from 'react';
import { SelectControl } from './SelectControl'; 
import { InfoComponentKey } from '../App'; // Import InfoComponentKey

interface ModelOption {
  id: string;
  name: string;
}

interface ModelConfiguratorProps {
  selectedModel: string;
  setSelectedModel: (value: string) => void;
  availableModels: ModelOption[];
  temperature: number;
  setTemperature: (value: number) => void;
  topP: number;
  setTopP: (value: number) => void;
  topK: number;
  setTopK: (value: number) => void;
  seed: string;
  setSeed: (value: string) => void;
  isLoading: boolean;
  onOpenInfoModal: (title: string, componentKey: InfoComponentKey) => void; // Updated prop type
}

const ParameterControl: React.FC<{
  id: string;
  label: string;
  value: number;
  setValue: (value: number) => void;
  min: number;
  max: number;
  step: number;
  isLoading: boolean;
  helpDocKey: InfoComponentKey; // Renamed from helpDoc
  valueFormatter?: (value: number) => string;
  onOpenInfoModal: (title: string, componentKey: InfoComponentKey) => void; // Updated prop type
}> = ({ id, label, value, setValue, min, max, step, isLoading, helpDocKey, valueFormatter, onOpenInfoModal }) => {
  const displayValue = valueFormatter ? valueFormatter(value) : value.toString();
  
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        <button
          type="button"
          onClick={() => onOpenInfoModal(`Tìm hiểu về ${label}`, helpDocKey)}
          className="ml-2 text-xs text-blue-500 hover:text-blue-700 underline focus:outline-none"
          aria-label={`Tìm hiểu thêm về ${label}`}
          disabled={isLoading}
        >
          (Tìm hiểu thêm)
        </button>
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="range"
          id={id}
          name={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          disabled={isLoading}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        />
        <input
          type="number"
          value={displayValue}
          onChange={(e) => {
            const rawValue = e.target.value;
            if (rawValue === '') {
                return; 
            }
            const numVal = parseFloat(rawValue);
            if (!isNaN(numVal) && numVal >= min && numVal <= max) {
              const precision = step.toString().split('.')[1]?.length || 0;
              setValue(parseFloat(numVal.toFixed(precision)));
            }
          }}
          onBlur={(e) => { 
            const numVal = parseFloat(e.target.value);
            if (isNaN(numVal) || numVal < min) setValue(min);
            else if (numVal > max) setValue(max);
          }}
          disabled={isLoading}
          className="w-24 p-1.5 border border-green-500 bg-green-600 text-white rounded-md text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:bg-gray-400 disabled:text-gray-200 disabled:border-gray-300 disabled:cursor-not-allowed text-center"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
          step={step}
          min={min}
          max={max}
        />
      </div>
    </div>
  );
};

const NumberInputControl: React.FC<{
    id: string;
    label: string;
    value: string; 
    setValue: (value: string) => void;
    placeholder: string;
    isLoading: boolean;
    helpDocKey: InfoComponentKey; // Renamed from helpDoc
    onOpenInfoModal: (title: string, componentKey: InfoComponentKey) => void; // Updated prop type
  }> = ({ id, label, value, setValue, placeholder, isLoading, helpDocKey, onOpenInfoModal }) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          <button
            type="button"
            onClick={() => onOpenInfoModal(`Tìm hiểu về ${label}`, helpDocKey)}
            className="ml-2 text-xs text-blue-500 hover:text-blue-700 underline focus:outline-none"
            aria-label={`Tìm hiểu thêm về ${label}`}
            disabled={isLoading}
          >
            (Tìm hiểu thêm)
          </button>
        </label>
        <input
          type="text" 
          inputMode="numeric" 
          pattern="[0-9]*"   
          id={id}
          name={id}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || /^\d+$/.test(val) || /^-?\d+$/.test(val)) {
               setValue(val);
            }
          }} 
          placeholder={placeholder}
          disabled={isLoading}
          className="w-full p-2 border border-green-500 bg-green-50 text-gray-700 rounded-md text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed"
          style={{ fontFamily: "'Times New Roman', Times, serif" }}
        />
      </div>
    );
  };


export const ModelConfigurator: React.FC<ModelConfiguratorProps> = ({
  selectedModel,
  setSelectedModel,
  availableModels,
  temperature,
  setTemperature,
  topP,
  setTopP,
  topK,
  setTopK,
  seed,
  setSeed,
  isLoading,
  onOpenInfoModal,
}) => {
  const modelOptions = availableModels.map(model => ({ value: model.id, label: model.name }));
  const [isConfigOpen, setIsConfigOpen] = useState(false); // Collapsed by default

  const toggleConfig = () => {
    setIsConfigOpen(prev => !prev);
  };

  return (
    <section className="w-full p-6 bg-white shadow-xl rounded-lg border border-green-200">
      <button
        onClick={toggleConfig}
        className="w-full flex justify-between items-center text-left focus:outline-none pb-3" // Added pb-3 for spacing
        aria-expanded={isConfigOpen}
        aria-controls="model-config-content-area"
        // disabled={isLoading} // This line disables the button when isLoading is true
      >
        <h2 className="text-xl font-semibold text-green-700" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
          Tinh Chỉnh Tham Số Sáng Tạo
        </h2>
        <span 
          className="text-2xl text-gray-600 transition-transform duration-300 ease-in-out"
          style={{ transform: isConfigOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {isConfigOpen && (
        <div 
          id="model-config-content-area" 
          className="mt-4 pt-4 border-t border-green-100 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 animate-fadeIn"
        >
          <div className="md:col-span-2 mb-4">
            <SelectControl
              id="modelSelection"
              label="Mô Hình AI"
              value={selectedModel}
              setValue={setSelectedModel}
              options={modelOptions}
              isLoading={isLoading}
              helpDocKey="modelSelection" 
              onOpenInfoModal={onOpenInfoModal}
            />
          </div>
          <ParameterControl
            id="temperature"
            label="Nhiệt Độ (Mức Sáng Tạo)"
            value={temperature}
            setValue={setTemperature}
            min={0.0}
            max={1.0} 
            step={0.01}
            isLoading={isLoading}
            helpDocKey="temperature" 
            valueFormatter={(v) => v.toFixed(2)}
            onOpenInfoModal={onOpenInfoModal}
          />
          <ParameterControl
            id="topP"
            label="Top-P (Mức Tập Trung)"
            value={topP}
            setValue={setTopP}
            min={0.01} 
            max={1.0}
            step={0.01}
            isLoading={isLoading}
            helpDocKey="topP" 
            valueFormatter={(v) => v.toFixed(2)}
            onOpenInfoModal={onOpenInfoModal}
          />
          <ParameterControl
            id="topK"
            label="Top-K (Phạm Vi Từ Vựng)"
            value={topK}
            setValue={setTopK}
            min={1}
            max={100} 
            step={1}
            isLoading={isLoading}
            helpDocKey="topK" 
            valueFormatter={(v) => v.toFixed(0)}
            onOpenInfoModal={onOpenInfoModal}
          />
          <div className="md:col-span-2">
            <NumberInputControl
              id="seed"
              label="Seed (Để Tái Tạo Kết Quả)"
              value={seed}
              setValue={setSeed}
              placeholder="Nhập một số nguyên (hoặc để trống để ngẫu nhiên)"
              isLoading={isLoading}
              helpDocKey="seed" 
              onOpenInfoModal={onOpenInfoModal}
            />
          </div>
        </div>
      )}
    </section>
  );
};
