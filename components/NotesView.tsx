'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NoteDocument } from '../lib/types';
import { ButtonConfirmModal, TypedConfirmModal } from './ConfirmModal';

interface NotesViewProps {
  artistId: string;
  notesList: NoteDocument[];
  onAddNote: (note: NoteDocument) => void;
  onUpdateNote: (note: NoteDocument) => void;
  onDeleteNote: (id: string) => void;
}

export function NotesView({
  artistId,
  notesList,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesViewProps) {
  const [selectedNote, setSelectedNote] = useState<NoteDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Modals
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [confirmDeleteNote, setConfirmDeleteNote] = useState<NoteDocument | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [body, setBody] = useState('');
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentNotes = notesList.filter((n) => !n.artistId || n.artistId === artistId);

  const handleStartAdd = () => {
    setTitle('');
    setDate(new Date().toISOString().slice(0, 10));
    setBody('');
    setSelectedNote(null);
    setIsCreating(true);
    setIsEditing(true); // new notes open directly to write full screen
  };

  const handleOpenNote = (note: NoteDocument) => {
    setSelectedNote(note);
    setTitle(note.title);
    setDate(note.date);
    setBody(note.body);
    setIsEditing(false); // opens in view mode first!
    setIsCreating(false);
  };

  const handleRequestEdit = () => {
    setShowEditConfirm(true);
  };

  const handleConfirmEdit = () => {
    setShowEditConfirm(false);
    setIsEditing(true);
  };

  const handleSave = (silent = false) => {
    if (!title.trim() && !body.trim()) return;

    const noteTitle = title.trim() || 'untitled';
    const noteDate = date || new Date().toISOString().slice(0, 10);

    if (isCreating || !selectedNote) {
      const newNote: NoteDocument = {
        id: 'note_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        artistId,
        title: noteTitle,
        date: noteDate,
        body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddNote(newNote);
      setSelectedNote(newNote);
      setIsCreating(false);
    } else {
      const updated: NoteDocument = {
        ...selectedNote,
        title: noteTitle,
        date: noteDate,
        body,
        updatedAt: new Date().toISOString(),
      };
      onUpdateNote(updated);
      setSelectedNote(updated);
    }

    if (!silent) {
      setIsEditing(false);
    }
  };

  const saveRef = useRef(handleSave);
  useEffect(() => {
    saveRef.current = handleSave;
  });

  // Auto-save debounce effect while editing
  useEffect(() => {
    if (!isEditing) return;
    if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(() => {
      saveRef.current(true);
    }, 2500);
    return () => {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
    };
  }, [title, date, body, isEditing]);

  // FULL SCREEN WRITING MODE (no container, nothing else on screen)
  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 bg-white text-[#111] flex flex-col p-3 overflow-hidden">
        {/* Title at top, date (auto), body in markdown */}
        <div className="flex items-center justify-between pb-2 border-b border-[#111] mb-2 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="font-medium text-xs border-b border-dashed border-[#888] pb-0.5 bg-transparent text-[#111] focus:outline-none flex-1 min-w-0"
            />
            <span className="text-[10px] text-[#777] font-mono shrink-0">{date}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                if (isCreating) setSelectedNote(null);
              }}
              className="text-xs text-[#666] hover:text-[#000] underline cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-2.5 py-1 text-xs bg-[#111] text-white border border-[#111] rounded-[3px] cursor-pointer hover:bg-[#333]"
            >
              Done
            </button>
          </div>
        </div>

        {/* Body below in markdown - no character limit */}
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          autoFocus
          className="w-full flex-1 p-0 text-xs font-mono leading-relaxed bg-transparent text-[#111] border-none resize-none focus:outline-none"
        />
      </div>
    );
  }

  // VIEW MODE (selected note preview)
  if (selectedNote) {
    return (
      <div className="w-full max-w-lg mx-auto p-3 text-xs">
        {/* Top controls */}
        <div className="flex items-center justify-between pb-1.5 border-b border-[#111] mb-3">
          <button
            type="button"
            onClick={() => setSelectedNote(null)}
            className="text-[11px] text-[#666] hover:text-[#000] underline cursor-pointer"
          >
            Back to list
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRequestEdit}
              className="px-2 py-0.5 border border-[#111] bg-white rounded-[3px] text-[11px] text-[#111] hover:bg-[#f2f2f2] cursor-pointer"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmDeleteNote(selectedNote)}
              className="text-[11px] text-[#888] hover:text-[#000] underline cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Title at the top, date (auto), body below */}
        <div className="space-y-3">
          <div className="border-b border-[#eee] pb-1">
            <h2 className="font-semibold text-sm text-[#111]">{selectedNote.title}</h2>
            <div className="text-[10px] text-[#888] font-mono mt-0.5">{selectedNote.date}</div>
          </div>
          <div className="font-mono text-xs text-[#222] whitespace-pre-wrap leading-relaxed">
            {selectedNote.body || '(Empty note)'}
          </div>
        </div>

        {/* Button Confirm Modal (Yes on left, No on right) */}
        <ButtonConfirmModal
          isOpen={showEditConfirm}
          title={`Edit note "${selectedNote.title}"?`}
          onConfirm={handleConfirmEdit}
          onCancel={() => setShowEditConfirm(false)}
        />

        {/* Typed Delete Confirmation */}
        <TypedConfirmModal
          isOpen={!!confirmDeleteNote}
          title={confirmDeleteNote ? `Delete note "${confirmDeleteNote.title}"` : ''}
          expectedText="Delete"
          onConfirm={() => {
            if (confirmDeleteNote) {
              onDeleteNote(confirmDeleteNote.id);
              setSelectedNote(null);
              setConfirmDeleteNote(null);
            }
          }}
          onCancel={() => setConfirmDeleteNote(null)}
        />
      </div>
    );
  }

  // NOTES LIST VIEW (page shows only notes list and an Add button)
  return (
    <div className="w-full max-w-lg mx-auto p-3 text-xs">
      <div className="flex items-center justify-between pb-1.5 border-b border-[#111] mb-3">
        <span className="font-semibold text-[#111]">Notes</span>
        <button
          type="button"
          onClick={handleStartAdd}
          className="px-2 py-0.5 border border-[#111] bg-white rounded-[3px] text-[11px] text-[#111] hover:bg-[#f2f2f2] cursor-pointer"
        >
          + Add
        </button>
      </div>

      {currentNotes.length === 0 ? (
        <div className="py-8 text-center text-[#777] text-xs">No notes added yet</div>
      ) : (
        <div className="divide-y divide-[#eee]">
          {currentNotes.map((note) => (
            <div
              key={note.id}
              className="py-2 flex items-center justify-between gap-2 hover:bg-[#fafafa]"
            >
              <button
                type="button"
                onClick={() => handleOpenNote(note)}
                className="text-left flex-1 min-w-0 cursor-pointer"
              >
                <div className="font-medium text-[#111] truncate">{note.title}</div>
                <div className="text-[10px] text-[#777] truncate font-mono">
                  {note.date} · {note.body.slice(0, 50).replace(/\n/g, ' ') || '(Empty)'}
                </div>
              </button>
              <span className="text-[10px] text-[#888] shrink-0">View</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
