import { useState } from 'react';
import { motion } from 'framer-motion';

interface CalculatorAppProps {
  onClose: () => void;
}

export default function CalculatorApp({ onClose }: CalculatorAppProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  };

  const percentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue;
      let result = 0;

      switch (operation) {
        case '+': result = currentValue + inputValue; break;
        case '-': result = currentValue - inputValue; break;
        case '×': result = currentValue * inputValue; break;
        case '÷': result = currentValue / inputValue; break;
        default: result = inputValue;
      }

      setDisplay(String(result));
      setPreviousValue(result);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (!operation || previousValue === null) return;

    const inputValue = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+': result = previousValue + inputValue; break;
      case '-': result = previousValue - inputValue; break;
      case '×': result = previousValue * inputValue; break;
      case '÷': result = previousValue / inputValue; break;
      default: result = inputValue;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const Button = ({
    label,
    onClick,
    className = '',
    wide = false,
  }: {
    label: string;
    onClick: () => void;
    className?: string;
    wide?: boolean;
  }) => (
    <motion.button
      className={`h-16 rounded-full text-2xl font-light active:scale-95 transition-transform ${className} ${wide ? 'col-span-2 pl-6 text-left' : ''}`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="w-full h-full bg-black flex flex-col justify-end pb-4">
      <div className="flex items-center justify-between px-6 py-4">
        <button className="text-white/70 text-sm" onClick={onClose}>
          取消
        </button>
        <span className="text-white/70 text-sm">计算器</span>
        <div className="w-12" />
      </div>

      <div className="text-right px-6 mb-2">
        <p className="text-white/50 text-lg truncate">{previousValue !== null ? previousValue : ''} {operation || ''}</p>
        <p className="text-white text-6xl font-light truncate">
          {display.length > 9 ? parseFloat(display).toExponential(4) : display}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 px-4">
        <Button label="AC" onClick={clear} className="bg-gray-400 text-black" />
        <Button label="+/-" onClick={toggleSign} className="bg-gray-400 text-black" />
        <Button label="%" onClick={percentage} className="bg-gray-400 text-black" />
        <Button
          label="÷"
          onClick={() => performOperation('÷')}
          className={`${operation === '÷' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}
        />

        <Button label="7" onClick={() => inputDigit('7')} className="bg-gray-700 text-white" />
        <Button label="8" onClick={() => inputDigit('8')} className="bg-gray-700 text-white" />
        <Button label="9" onClick={() => inputDigit('9')} className="bg-gray-700 text-white" />
        <Button
          label="×"
          onClick={() => performOperation('×')}
          className={`${operation === '×' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}
        />

        <Button label="4" onClick={() => inputDigit('4')} className="bg-gray-700 text-white" />
        <Button label="5" onClick={() => inputDigit('5')} className="bg-gray-700 text-white" />
        <Button label="6" onClick={() => inputDigit('6')} className="bg-gray-700 text-white" />
        <Button
          label="-"
          onClick={() => performOperation('-')}
          className={`${operation === '-' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}
        />

        <Button label="1" onClick={() => inputDigit('1')} className="bg-gray-700 text-white" />
        <Button label="2" onClick={() => inputDigit('2')} className="bg-gray-700 text-white" />
        <Button label="3" onClick={() => inputDigit('3')} className="bg-gray-700 text-white" />
        <Button
          label="+"
          onClick={() => performOperation('+')}
          className={`${operation === '+' ? 'bg-white text-orange-500' : 'bg-orange-500 text-white'}`}
        />

        <Button label="0" onClick={() => inputDigit('0')} className="bg-gray-700 text-white" wide />
        <Button label="." onClick={inputDecimal} className="bg-gray-700 text-white" />
        <Button label="=" onClick={calculate} className="bg-orange-500 text-white" />
      </div>
    </div>
  );
}
