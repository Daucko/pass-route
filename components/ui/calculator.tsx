'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calculator as CalculatorIcon,
  Delete,
  Percent,
  Divide,
  X,
  Minus,
  Plus,
  Equal,
} from 'lucide-react';

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const result = calculate();
      setPreviousValue(result);
      setDisplay(String(result));
    }

    setOperation(op);
    setWaitingForNewValue(true);
  };

  const calculate = () => {
    const inputValue = parseFloat(display);
    if (previousValue === null || operation === null) return inputValue;

    switch (operation) {
      case '+':
        return previousValue + inputValue;
      case '-':
        return previousValue - inputValue;
      case '×':
        return previousValue * inputValue;
      case '÷':
        return previousValue / inputValue;
      case '%':
        return previousValue % inputValue;
      default:
        return inputValue;
    }
  };

  const handleEquals = () => {
    if (operation === null || previousValue === null) return;

    const result = calculate();
    setDisplay(String(result));
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleDelete = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handlePercent = () => {
    const value = parseFloat(display);
    setDisplay(String(value / 100));
  };

  const buttons = [
    {
      label: 'C',
      action: () => handleClear(),
      variant: 'destructive' as const,
    },
    { label: <Delete size={20} />, action: () => handleDelete() },
    { label: <Percent size={20} />, action: () => handlePercent() },
    {
      label: <Divide size={20} />,
      action: () => handleOperation('÷'),
      variant: 'secondary' as const,
    },
    { label: '7', action: () => handleNumber('7') },
    { label: '8', action: () => handleNumber('8') },
    { label: '9', action: () => handleNumber('9') },
    {
      label: <X size={20} />,
      action: () => handleOperation('×'),
      variant: 'secondary' as const,
    },
    { label: '4', action: () => handleNumber('4') },
    { label: '5', action: () => handleNumber('5') },
    { label: '6', action: () => handleNumber('6') },
    {
      label: <Minus size={20} />,
      action: () => handleOperation('-'),
      variant: 'secondary' as const,
    },
    { label: '1', action: () => handleNumber('1') },
    { label: '2', action: () => handleNumber('2') },
    { label: '3', action: () => handleNumber('3') },
    {
      label: <Plus size={20} />,
      action: () => handleOperation('+'),
      variant: 'secondary' as const,
    },
    { label: '0', action: () => handleNumber('0'), className: 'col-span-2' },
    { label: '.', action: () => handleDecimal() },
    {
      label: <Equal size={20} />,
      action: () => handleEquals(),
      variant: 'default' as const,
    },
  ];

  return (
    <Card className="bg-[#0A0A0F] border-white/10">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <CalculatorIcon className="w-5 h-5" />
          Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Display */}
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground h-6">
                {previousValue !== null &&
                  `${previousValue} ${operation || ''}`}
              </div>
              <div className="text-3xl font-mono font-bold text-white truncate">
                {display}
              </div>
            </div>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-4 gap-2">
            {buttons.map((button, index) => (
              <Button
                key={index}
                onClick={button.action}
                variant={button.variant || 'outline'}
                size="lg"
                className={`
                  h-14 text-lg font-medium
                  ${
                    button.variant === 'secondary'
                      ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30 text-blue-400'
                      : button.variant === 'destructive'
                      ? 'bg-red-500/20 hover:bg-red-500/30 border-red-500/30 text-red-400'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  }
                  ${button.className || ''}
                `}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
