'use client';

import React from 'react';
import { Artist } from '../lib/types';
import { Search } from 'lucide-react';

export type ActivePage =
  | 'home'
  | 'add-artist'
  | 'profile'
  | 'release'
  | 'unreleased'
  | 'achievements'
  | 'artworks'
  | 'lyrics'
  | 'discography'
  | 'features'
  | 'notes'
  | 'miscellaneous'
  | 'export-import'
  | 'artists';

interface TopNavProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  selectedArtist: Artist | null;
  onSelectArtist: (artist: Artist | null) => void;
  onOpenSearch: () => void;
}

export function TopNav({
  activePage,
  onNavigate,
  selectedArtist,
  onSelectArtist,
  onOpenSearch,
}: TopNavProps) {
  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'release', label: 'Release' },
    { id: 'unreleased', label: 'Unreleased' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'artworks', label: 'Artworks' },
    { id: 'lyrics', label: 'Lyrics' },
    { id: 'discography', label: 'Discography' },
    { id: 'features', label: 'Features' },
    { id: 'notes', label: 'Notes' },
    { id: 'miscellaneous', label: 'Miscellaneous' },
    { id: 'export-import', label: 'Export/Import' },
    { id: 'artists', label: 'Artists' },
  ];

  if (!selectedArtist) {
    return (
      <header className="border-b border-[#111] bg-white px-2 py-1.5">
        <div className="flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-[12px] font-medium text-[#111] hover:underline cursor-pointer"
          >
            Pseudonymous
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenSearch}
              className="px-1.5 py-0.5 text-[11px] rounded-[3px] border border-[#888] bg-white text-[#111] hover:border-[#111] cursor-pointer inline-flex items-center gap-1"
              aria-label="Search"
              title="Universal search"
            >
              <Search className="w-3 h-3" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('export-import')}
              className={`px-1.5 py-0.5 text-[11px] rounded-[3px] border cursor-pointer ${
                activePage === 'export-import'
                  ? 'bg-[#111] text-white border-[#111]'
                  : 'bg-white text-[#111] border-[#888] hover:border-[#111]'
              }`}
            >
              Export/Import
            </button>
            <button
              type="button"
              onClick={() => onNavigate('add-artist')}
              className={`px-1.5 py-0.5 text-[11px] rounded-[3px] border cursor-pointer ${
                activePage === 'add-artist'
                  ? 'bg-[#111] text-white border-[#111]'
                  : 'bg-white text-[#111] border-[#888] hover:border-[#111]'
              }`}
            >
              + Add artist
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-[#111] bg-white px-2 py-1.5">
      {/* Top row: Artist name & switch artist */}
      <div className="flex items-center justify-between text-xs mb-1.5 pb-1 border-b border-[#e5e5e5]">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-[#111] truncate">{selectedArtist.name}</span>
          <span className="text-[#777] text-[11px]">({selectedArtist.category ? selectedArtist.category.charAt(0).toUpperCase() + selectedArtist.category.slice(1) : ''})</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="px-1.5 py-0.5 text-[11px] rounded-[3px] border border-[#888] bg-white text-[#111] hover:border-[#111] cursor-pointer inline-flex items-center gap-1"
            aria-label="Search"
            title="Universal search"
          >
            <Search className="w-3 h-3" />
            <span className="hidden sm:inline">Search</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onSelectArtist(null);
              onNavigate('home');
            }}
            className="text-[11px] text-[#444] hover:text-[#000] underline cursor-pointer"
          >
            All artists
          </button>
        </div>
      </div>

      {/* Nav items wrapped cleanly without horizontal scroll */}
      <nav className="flex flex-wrap gap-1 text-[11px]">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.id === 'artists') {
                  onSelectArtist(null);
                  onNavigate('artists');
                } else {
                  onNavigate(item.id);
                }
              }}
              className={`px-1.5 py-0.5 rounded-[3px] border cursor-pointer leading-tight transition-none ${
                isActive
                  ? 'bg-[#111] text-white border-[#111]'
                  : 'bg-white text-[#333] border-[#ccc] hover:border-[#888]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
