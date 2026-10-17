'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  value: string;
  options: (Option | string)[];
  onChange: (value: string) => void;
  allowCustom?: boolean;
  disabled?: boolean;
  className?: string;
  emptyLabel?: string;
}

export function CustomDropdown({
  value,
  options,
  onChange,
  allowCustom = false,
  disabled = false,
  className = '',
  emptyLabel = 'Select...',
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedOptions: Option[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find(
    (o) => o.value.toLowerCase() === value.toLowerCase()
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsAddingCustom(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setIsAddingCustom(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.trim()) {
      onChange(customInput.trim());
      setCustomInput('');
      setIsAddingCustom(false);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative text-xs ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-1 px-1.5 border border-[#888] bg-white text-[#111] flex items-center justify-between rounded-[3px] hover:border-[#111] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : value ? value : emptyLabel}
        </span>
        <ChevronDown className="w-3 h-3 ml-1 shrink-0 text-[#666]" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-full min-w-[140px] max-h-52 overflow-y-auto z-50 bg-white border border-[#111] shadow-none rounded-[3px]">
          {normalizedOptions.length === 0 && !allowCustom && (
            <div className="p-1.5 text-[#777] italic text-[11px]">None</div>
          )}

          {normalizedOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleSelect(opt.value)}
              className={`w-full text-left px-2 py-1 text-xs block cursor-pointer hover:bg-[#eee] ${
                opt.value.toLowerCase() === value.toLowerCase() ? 'bg-[#111] text-white hover:bg-[#111]' : 'text-[#111]'
              }`}
            >
              {opt.label}
            </button>
          ))}

          {allowCustom && (
            <div className="border-t border-[#ccc] p-1 bg-[#fafafa]">
              {isAddingCustom ? (
                <form onSubmit={handleCustomSubmit} className="flex gap-1">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    autoFocus
                    className="w-full text-xs py-0.5 px-1 border border-[#666] bg-white text-[#111] rounded-[2px]"
                  />
                  <button
                    type="submit"
                    className="px-1.5 py-0.5 text-xs bg-[#111] text-white rounded-[2px] cursor-pointer"
                  >
                    Ok
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="px-1.5 py-0.5 text-xs border border-[#888] text-[#333] rounded-[2px] cursor-pointer"
                  >
                    x
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(true)}
                  className="w-full text-left px-1.5 py-1 text-[11px] text-[#444] hover:text-[#000] cursor-pointer"
                >
                  + Add custom...
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
