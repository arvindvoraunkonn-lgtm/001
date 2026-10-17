'use client';

import React, { useState, useRef } from 'react';
import { LyricsDocument } from '../lib/types';
import { ButtonConfirmModal, TypedConfirmModal } from './ConfirmModal';

interface LyricsViewProps {
  artistId: string;
  lyricsList: LyricsDocument[];
  onAddLyrics: (lyrics: LyricsDocument) => void;
  onUpdateLyrics: (lyrics: LyricsDocument) => void;
  onDeleteLyrics: (id: string) => void;
}

const STRUCTURE_TAGS = [
  'Verse',
  'Verse 1',
  'Verse 2',
  'Pre-chorus',
  'Chorus',
  'Hook',
  'Bridge',
  'Intro',
  'Outro',
  'Instrumental',
  'Breakdown',
  'Drop',
  'Refrain',
];

export function LyricsView({
  artistId,
  lyricsList,
  onAddLyrics,
  onUpdateLyrics,
  onDeleteLyrics,
}: LyricsViewProps) {
  const [selectedLyrics, setSelectedLyrics] = useState<LyricsDocument | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Modals
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [confirmDeleteDoc, setConfirmDeleteDoc] = useState<LyricsDocument | null>(null);

  // Form states
  const [fileName, setFileName] = useState('');
  const [lyricsContent, setLyricsContent] = useState('');

  // Slash menu state
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashCursorPos, setSlashCursorPos] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const currentLyrics = lyricsList.filter((l) => l.artistId === artistId);

  const handleStartCreate = () => {
    setFileName('new_lyrics.txt');
    setLyricsContent('');
    setSelectedLyrics(null);
    setIsCreating(true);
    setIsEditing(true); // new files open directly to write
  };

  const handleOpenDoc = (doc: LyricsDocument) => {
    setSelectedLyrics(doc);
    setFileName(doc.fileName);
    setLyricsContent(doc.lyrics);
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

  const handleSave = () => {
    if (!fileName.trim()) return;

    if (isCreating || !selectedLyrics) {
      const newDoc: LyricsDocument = {
        id: 'lyr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        artistId,
        fileName: fileName.trim(),
        lyrics: lyricsContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onAddLyrics(newDoc);
      setSelectedLyrics(newDoc);
    } else {
      const updated: LyricsDocument = {
        ...selectedLyrics,
        fileName: fileName.trim(),
        lyrics: lyricsContent,
        updatedAt: new Date().toISOString(),
      };
      onUpdateLyrics(updated);
      setSelectedLyrics(updated);
    }

    setIsEditing(false);
    setIsCreating(false);
  };

  // Slash menu handler
  const handleLyricsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart;
    setLyricsContent(val);

    // check if user just typed '/'
    if (pos > 0 && val[pos - 1] === '/') {
      setShowSlashMenu(true);
      setSlashCursorPos(pos - 1);
    } else {
      setShowSlashMenu(false);
      setSlashCursorPos(null);
    }
  };

  const insertStructureTag = (tag: string) => {
    if (slashCursorPos === null) return;
    const before = lyricsContent.slice(0, slashCursorPos);
    const after = lyricsContent.slice(slashCursorPos + 1);
    const tagText = `[${tag}]\n`;
    const newContent = before + tagText + after;
    setLyricsContent(newContent);
    setShowSlashMenu(false);
    setSlashCursorPos(null);

    // Focus back on textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const nextPos = before.length + tagText.length;
        textareaRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  };

  // FULL SCREEN WRITING MODE (editing/creating)
  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 bg-white text-[#111] flex flex-col p-3 overflow-hidden">
        {/* File name at top, controls at top, nothing at bottom */}
        <div className="flex items-center justify-between pb-2 border-b border-[#111] mb-2 shrink-0">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="font-medium text-xs border-b border-dashed border-[#888] pb-0.5 bg-transparent text-[#111] focus:outline-none w-2/3"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                if (isCreating) setSelectedLyrics(null);
              }}
              className="px-2 py-0.5 text-xs text-[#666] hover:text-[#000] underline cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-2.5 py-1 text-xs bg-[#111] text-white border border-[#111] rounded-[3px] cursor-pointer hover:bg-[#333]"
            >
              Save
            </button>
          </div>
        </div>

        {/* Slash structure selector popup */}
        {showSlashMenu && (
          <div className="border border-[#111] bg-white rounded-[3px] p-1 mb-2 max-h-36 overflow-y-auto text-xs shadow-none">
            <div className="text-[10px] text-[#666] px-1 pb-1 border-b border-[#eee]">
              Structure options:
            </div>
            <div className="grid grid-cols-3 gap-1 pt-1">
              {STRUCTURE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => insertStructureTag(tag)}
                  className="text-left px-1.5 py-1 text-xs hover:bg-[#eee] rounded-[2px] cursor-pointer"
                >
                  [{tag}]
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Lyrics body: full screen, no container, nothing else on screen */}
        <textarea
          ref={textareaRef}
          value={lyricsContent}
          onChange={handleLyricsChange}
          autoFocus
          className="w-full flex-1 p-0 text-xs font-mono leading-relaxed bg-transparent text-[#111] border-none resize-none focus:outline-none"
        />
      </div>
    );
  }

  // VIEW MODE (selected document)
  if (selectedLyrics) {
    return (
      <div className="w-full max-w-lg mx-auto p-3 text-xs">
        {/* Top controls */}
        <div className="flex items-center justify-between pb-1.5 border-b border-[#111] mb-3">
          <button
            type="button"
            onClick={() => setSelectedLyrics(null)}
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
              onClick={() => setConfirmDeleteDoc(selectedLyrics)}
              className="text-[11px] text-[#888] hover:text-[#000] underline cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>

        {/* View Document: File name at top, lyrics below */}
        <div className="space-y-3">
          <div className="font-semibold text-sm text-[#111] border-b border-[#eee] pb-1">
            {selectedLyrics.fileName}
          </div>
          <div className="font-mono text-xs text-[#222] whitespace-pre-wrap leading-relaxed">
            {selectedLyrics.lyrics || '(Empty lyrics document)'}
          </div>
        </div>

        {/* Button Confirm Modal (Yes on left, No on right) */}
        <ButtonConfirmModal
          isOpen={showEditConfirm}
          title={`Edit "${selectedLyrics.fileName}"?`}
          onConfirm={handleConfirmEdit}
          onCancel={() => setShowEditConfirm(false)}
        />

        {/* Typed Delete Confirmation */}
        <TypedConfirmModal
          isOpen={!!confirmDeleteDoc}
          title={confirmDeleteDoc ? `Delete "${confirmDeleteDoc.fileName}"` : ''}
          expectedText="Delete"
          onConfirm={() => {
            if (confirmDeleteDoc) {
              onDeleteLyrics(confirmDeleteDoc.id);
              setSelectedLyrics(null);
              setConfirmDeleteDoc(null);
            }
          }}
          onCancel={() => setConfirmDeleteDoc(null)}
        />
      </div>
    );
  }

  // LIST VIEW: dedicated page showing lyrics files list and add button
  return (
    <div className="w-full max-w-lg mx-auto p-3 text-xs">
      <div className="flex items-center justify-between pb-1.5 border-b border-[#111] mb-3">
        <span className="font-semibold text-[#111]">Lyrics</span>
        <button
          type="button"
          onClick={handleStartCreate}
          className="px-2 py-0.5 border border-[#111] bg-white rounded-[3px] text-[11px] text-[#111] hover:bg-[#f2f2f2] cursor-pointer"
        >
          + Add
        </button>
      </div>

      {currentLyrics.length === 0 ? (
        <div className="py-8 text-center text-[#777] text-xs">No lyrics added yet</div>
      ) : (
        <div className="divide-y divide-[#eee]">
          {currentLyrics.map((doc) => (
            <div
              key={doc.id}
              className="py-2 flex items-center justify-between gap-2 hover:bg-[#fafafa]"
            >
              <button
                type="button"
                onClick={() => handleOpenDoc(doc)}
                className="text-left flex-1 min-w-0 cursor-pointer"
              >
                <div className="font-medium text-[#111] truncate">{doc.fileName}</div>
                <div className="text-[10px] text-[#777] truncate font-mono">
                  {doc.lyrics.slice(0, 60).replace(/\n/g, ' ') || '(Empty)'}
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
