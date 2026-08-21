import React, { useState, useRef, useEffect } from 'react';
import { Plane, Search, X, MapPin, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Airport, searchAirports } from '../data/airports';

interface AirportInputProps {
  id?: string;
  label?: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
}

export default function AirportInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  icon: Icon = MapPin,
  required = false
}: AirportInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update suggestions whenever value or open state changes
  useEffect(() => {
    const trimmed = (value || '').trim();
    if (isOpen && trimmed) {
      const results = searchAirports(trimmed, 20);
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [value, isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    onChange(airport.name);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input container */}
      <div 
        className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-transparent focus-within:border-donghai/30 transition-colors"
      >
        <Icon className="w-4 h-4 text-gray-400 shrink-0" />
        <input 
          id={id}
          type="text" 
          placeholder={placeholder}
          value={value}
          onFocus={() => {
            if ((value || '').trim()) {
              setIsOpen(true);
            }
          }}
          onChange={(e) => {
            const nextVal = e.target.value;
            onChange(nextVal);
            if (nextVal.trim()) {
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
          }}
          className="bg-transparent border-none outline-none text-xs w-full text-gray-800 placeholder:text-gray-300"
          required={required}
          autoComplete="off"
        />
        {value && (
          <button 
            type="button" 
            onClick={handleClear}
            className="text-gray-300 hover:text-gray-500 p-0.5 rounded-full hover:bg-gray-200/60 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Top-layer Floating Dropdown Overlay (Does NOT shift form layout) */}
      <AnimatePresence>
        {isOpen && (value || '').trim() && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 overflow-hidden max-h-56 flex flex-col"
          >
            <div className="px-2 py-1 flex items-center justify-between text-[10px] text-gray-400 font-medium border-b border-gray-100 pb-1 mb-1 shrink-0">
              <span>匹配结果 {suggestions.length > 0 ? `(${suggestions.length}项)` : ''}</span>
              <span className="text-[9px] text-donghai font-normal">点击快速填入</span>
            </div>

            {suggestions.length > 0 ? (
              <div className="overflow-y-auto space-y-1 pr-0.5 overscroll-contain max-h-44">
                {suggestions.map((item) => {
                  const isSelected = value === item.name || value === item.shortName;
                  return (
                    <div
                      key={item.code + item.name}
                      onClick={() => handleSelect(item)}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        isSelected 
                          ? 'bg-donghai text-white font-medium shadow-xs' 
                          : 'hover:bg-gray-50 active:bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.city}
                        </span>
                        <span className="truncate text-[11px] font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <span className={`font-mono text-[10px] uppercase font-bold tracking-wider ${
                          isSelected ? 'text-white/80' : 'text-gray-400'
                        }`}>
                          {item.code}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-3 text-center text-xs text-gray-400">
                <p>未找到匹配机场</p>
                <p className="text-[10px] text-gray-300 mt-0.5">将直接使用当前输入的内容</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
