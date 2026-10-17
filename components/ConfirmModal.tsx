'use client';

import React, { useState } from 'react';

export interface TypedConfirmProps {
  isOpen: boolean;
  title: string;
  expectedText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function TypedConfirmModal({
  isOpen,
  title,
  expectedText,
  onConfirm,
  onCancel,
}: TypedConfirmProps) {
  const [typed, setTyped] = useState('');

  if (!isOpen) return null;

  const isMatch = typed.trim().toLowerCase() === expectedText.toLowerCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMatch) {
      setTyped('');
      onConfirm();
    }
  };

  const handleClose = () => {
    setTyped('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3">
      <div className="w-full max-w-sm bg-white border border-[#111] p-3 rounded-[3px] text-xs">
        <div className="mb-2 text-[#111] font-medium leading-tight">{title}</div>
        <div className="mb-2 text-[#555] text-[11px]">
          Type &quot;{expectedText}&quot; to confirm:
        </div>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoFocus
            className="w-full border border-[#888] p-1.5 text-xs text-[#111] bg-white rounded-[2px]"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="px-2.5 py-1 text-xs border border-[#888] text-[#333] rounded-[3px] cursor-pointer hover:bg-[#f0f0f0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isMatch}
              className="px-2.5 py-1 text-xs bg-[#111] text-white border border-[#111] rounded-[3px] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export interface ButtonConfirmProps {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Button confirmation asking whether to edit or proceed.
 * CRITICAL RULE: "Yes" is on the left and "No" is on the right, to avoid muscle memory.
 */
export function ButtonConfirmModal({
  isOpen,
  title,
  onConfirm,
  onCancel,
}: ButtonConfirmProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3">
      <div className="w-full max-w-xs bg-white border border-[#111] p-3 rounded-[3px] text-xs">
        <div className="mb-3 text-[#111] leading-tight">{title}</div>
        <div className="flex items-center gap-2">
          {/* YES ON LEFT */}
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-1.5 px-3 bg-[#111] text-white text-xs border border-[#111] rounded-[3px] cursor-pointer hover:bg-[#333]"
          >
            Yes
          </button>
          {/* NO ON RIGHT */}
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-1.5 px-3 bg-white text-[#111] text-xs border border-[#888] rounded-[3px] cursor-pointer hover:bg-[#f0f0f0]"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
