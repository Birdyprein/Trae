import { useState } from 'react';

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
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clearAll = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  };

  const percentage = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue;
      let result = 0;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = currentValue / inputValue;
          break;
        default:
          result = inputValue;
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
      case '+':
        result = previousValue + inputValue;
        break;
      case '-':
        result = previousValue - inputValue;
        break;
      case '×':
        result = previousValue * inputValue;
        break;
      case '÷':
        result = previousValue / inputValue;
        break;
      default:
        result = inputValue;
    }

    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(true);
  };

  const Button = ({
    label,
    onClick,
    className = ''
  }: {
    label: string;
    onClick: () => void;
    className?: string;
  }) => (
    <button
      className={`h-16 rounded-full text-2xl font-light active:opacity-70 transition-opacity ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full h-full bg-black flex flex-col justify-end pb-4">
      <div className="text-right px-6 mb-4">
        <p className="text-white text-6xl font-light truncate">
          {display.length > 9 ? parseFloat(display).toExponential(4) : display}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3 px-4">
        <Button label="AC" onClick={clearAll} className="bg-gray-400 text-black" />
        <Button label="+/-" onClick={toggleSign} className="bg-gray-400 text-black" />
        <Button label="%" onClick={percentage} className="bg-gray-400 text-black" />
        <Button
          label="÷"
          onClick={() => performOperation('÷')}
          className={`bg-orange-500 text-white ${operation === '÷' ? 'bg-white text-orange-500' : ''}`}
        />

        <Button label="7" onClick={() => inputDigit('7')} className="bg-gray-700 text-white" />
        <Button label="8" onClick={() => inputDigit('8')} className="bg-gray-700 text-white" />
        <Button label="9" onClick={() => inputDigit('9')} className="bg-gray-700 text-white" />
        <Button
          label="×"
          onClick={() => performOperation('×')}
          className={`bg-orange-500 text-white ${operation === '×' ? 'bg-white text-orange-500' : ''}`}
        />

        <Button label="4" onClick={() => inputDigit('4')} className="bg-gray-700 text-white" />
        <Button label="5" onClick={() => inputDigit('5')} className="bg-gray-700 text-white" />
        <Button label="6" onClick={() => inputDigit('6')} className="bg-gray-700 text-white" />
        <Button
          label="-"
          onClick={() => performOperation('-')}
          className={`bg-orange-500 text-white ${operation === '-' ? 'bg-white text-orange-500' : ''}`}
        />

        <Button label="1" onClick={() => inputDigit('1')} className="bg-gray-700 text-white" />
        <Button label="2" onClick={() => inputDigit('2')} className="bg-gray-700 text-white" />
        <Button label="3" onClick={() => inputDigit('3')} className="bg-gray-700 text-white" />
        <Button
          label="+"
          onClick={() => performOperation('+')}
          className={`bg-orange-500 text-white ${operation === '+' ? 'bg-white text-orange-500' : ''}`}
        />

        <button
          className="col-span-2 h-16 rounded-full bg-gray-700 text-white text-2xl font-light text-left pl-6 active:opacity-70 transition-opacity"
          onClick={() => inputDigit('0')}
        >
          0
        </button>
        <Button label="." onClick={inputDecimal} className="bg-gray-700 text-white" />
        <Button label="=" onClick={calculate} className="bg-orange-500 text-white" />
      </div>
    </div>
  );
}
