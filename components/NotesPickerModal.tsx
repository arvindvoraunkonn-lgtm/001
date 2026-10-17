'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { NoteDocument } from '../lib/types';
import { X, Search } from 'lucide-react';

interface NotesPickerModalProps {
  isOpen: boolean;
  notes: NoteDocument[];
  /** artistId to filter notes by (also includes shared notes with no artistId) */
  artistId: string;
  /** Currently selected note ids */
  selectedIds: string[];
  onConfirm: (selectedIds: string[]) => void;
  onCancel: () => void;
}

/**
 * Modal for picking one or more notes to link to an achievement.
 * Shows a search input at the top, a scrollable list of notes (filtered
 * to this artist + shared notes), with check toggles for each.
 *
 * Used by AchievementsView's add/edit form so the user can attach notes
 * that document or relate to the achievement.
 */
export function NotesPickerModal({
  isOpen,
  notes,
  artistId,
  selectedIds,
  onConfirm,
  onCancel,
}: NotesPickerModalProps) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>(selectedIds);

  // Reset internal state each time the modal opens (not on every keystroke).
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelected(selectedIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const filteredNotes = useMemo(() => {
    const artistNotes = notes.filter(
      (n) => !n.artistId || n.artistId === artistId
    );
    if (!query.trim()) return artistNotes;
    const q = query.trim().toLowerCase();
    return artistNotes.filter(
      (n) =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.body || '').toLowerCase().includes(q) ||
        (n.date || '').toLowerCase().includes(q)
    );
  }, [notes, artistId, query]);

  if (!isOpen) return null;

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-3"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-[6px] p-3 max-w-md w-full space-y-3 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#111]">
          <span className="font-semibold text-[#111] text-sm">Link notes</span>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#666] hover:text-[#111] cursor-pointer p-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#999]" />
          <input
            type="text"
            autoFocus
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-[#888] pl-7 pr-2 py-1.5 bg-white text-[#111] text-xs rounded-[2px] focus:outline-none focus:border-[#111]"
          />
        </div>

        {/* Notes list */}
        <div className="max-h-72 overflow-y-auto divide-y divide-[#eee] border border-[#ddd] rounded-[3px]">
          {filteredNotes.length === 0 ? (
            <div className="p-3 text-center text-[#777] text-xs">
              No notes found
            </div>
          ) : (
            filteredNotes.map((n) => {
              const checked = selected.includes(n.id);
              return (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggle(n.id)}
                  className={`w-full text-left p-2 cursor-pointer flex items-start gap-2 ${
                    checked ? 'bg-[#f4f4f4]' : 'bg-white hover:bg-[#fafafa]'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    <div
                      className={`w-4 h-4 rounded-[2px] border flex items-center justify-center ${
                        checked
                          ? 'bg-[#111] border-[#111] text-white'
                          : 'bg-white border-[#888]'
                      }`}
                    >
                      {checked && (
                        <svg viewBox="0 0 12 12" className="w-3 h-3 fill-current">
                          <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-[#111] text-xs truncate">
                      {n.title || 'Untitled'}
                    </div>
                    <div className="text-[10px] text-[#777] truncate">
                      {n.date} · {(n.body || '').slice(0, 60).replace(/\n/g, ' ')}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-[#777]">
            {selected.length} selected
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1.5 bg-white text-[#111] border border-[#888] rounded-[3px] text-xs hover:bg-[#f2f2f2] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(selected)}
              className="px-3 py-1.5 bg-[#111] text-white border border-[#111] rounded-[3px] text-xs hover:bg-[#333] cursor-pointer"
            >
              Link {selected.length > 0 ? `(${selected.length})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
