'use client';

import React, { useState, useEffect } from 'react';
import { Artist } from '../lib/types';
import { LayoutList, LayoutGrid, Search } from 'lucide-react';
import { ArtistAvatar } from './ArtistAvatar';
import { loadViewPref, saveViewPref } from '../lib/view-prefs';

interface HomeViewProps {
  artists: Artist[];
  hasData: boolean;
  onOpenExportImport: () => void;
  onAddArtist: () => void;
  onSelectArtist: (artist: Artist) => void;
  onOpenSearch: () => void;
}

export function HomeView({
  artists,
  hasData,
  onOpenExportImport,
  onAddArtist,
  onSelectArtist,
  onOpenSearch,
}: HomeViewProps) {
  // Persist view preference (list / grid) across page navigations and reloads.
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    const saved = loadViewPref('home.artists', 'list');
    if (saved === 'list' || saved === 'grid') return saved;
    return 'list';
  });
  useEffect(() => {
    saveViewPref('home.artists', viewMode);
  }, [viewMode]);

  // Optional local filter so user can quickly find an artist in a long list
  const [filter, setFilter] = useState('');

  const visibleArtists = filter.trim()
    ? artists.filter((a) => {
        const q = filter.trim().toLowerCase();
        return (
          (a.name || '').toLowerCase().includes(q) ||
          (a.actualName || '').toLowerCase().includes(q) ||
          (a.genre || '').toLowerCase().includes(q) ||
          (a.subGenre || '').toLowerCase().includes(q) ||
          (a.label || '').toLowerCase().includes(q) ||
          (a.distributor || '').toLowerCase().includes(q)
        );
      })
    : artists;

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 text-xs">
      {/* 1. Import / Export (zip) */}
      <div>
        <button
          type="button"
          onClick={onOpenExportImport}
          className="w-full py-2 px-3 border border-[#111] bg-white text-[#111] rounded-[3px] text-xs hover:bg-[#f4f4f4] cursor-pointer"
        >
          {hasData ? 'Import / Export (zip)' : 'Import (zip)'}
        </button>
      </div>

      {/* 2. Add Artist */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onAddArtist}
          className="flex-1 py-2 px-3 border border-[#111] bg-[#111] text-white rounded-[3px] text-xs hover:bg-[#333] cursor-pointer"
        >
          Add artist
        </button>
        <button
          type="button"
          onClick={onOpenSearch}
          className="px-3 py-2 border border-[#888] bg-white text-[#111] rounded-[3px] text-xs hover:border-[#111] cursor-pointer inline-flex items-center gap-1"
          title="Universal search"
        >
          <Search className="w-3 h-3" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* 3. Artists (list or grid, switchable, once any exist) */}
      {artists.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#111] mb-2 gap-2">
            <span className="font-medium text-[#111]">Artists ({artists.length})</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1 border rounded-[2px] cursor-pointer ${
                  viewMode === 'list'
                    ? 'border-[#111] bg-[#111] text-white'
                    : 'border-[#ccc] bg-white text-[#666]'
                }`}
                aria-label="List view"
                title="List view"
              >
                <LayoutList className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1 border rounded-[2px] cursor-pointer ${
                  viewMode === 'grid'
                    ? 'border-[#111] bg-[#111] text-white'
                    : 'border-[#ccc] bg-white text-[#666]'
                }`}
                aria-label="Grid view"
                title="Grid view"
              >
                <LayoutGrid className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Quick filter input */}
          {artists.length > 3 && (
            <input
              type="text"
              placeholder="Filter artists by name, genre, label..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border border-[#888] p-1.5 bg-white text-[#111] text-xs rounded-[2px] mb-2 focus:outline-none focus:border-[#111]"
            />
          )}

          {visibleArtists.length === 0 ? (
            <div className="py-6 text-center text-[#777]">No artists match your filter</div>
          ) : viewMode === 'list' ? (
            <div className="divide-y divide-[#eee]">
              {visibleArtists.map((artist) => (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => onSelectArtist(artist)}
                  className="w-full text-left py-2 px-1 hover:bg-[#f7f7f7] cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <ArtistAvatar
                      url={artist.profileImageUrl}
                      fileId={artist.profileImageFileId}
                      name={artist.name}
                      sizeClassName="w-10 h-10"
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-[#111] truncate">{artist.name}</div>
                      <div className="text-[11px] text-[#666] truncate">
                        {artist.genre}
                        {artist.subGenre ? ` / ${artist.subGenre}` : ''}
                        {artist.label ? ` · ${artist.label}` : ''}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#888] shrink-0">Open</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {visibleArtists.map((artist) => (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => onSelectArtist(artist)}
                  className="text-left p-2 border border-[#ccc] rounded-[3px] hover:border-[#111] hover:bg-[#f7f7f7] cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <ArtistAvatar
                      url={artist.profileImageUrl}
                      fileId={artist.profileImageFileId}
                      name={artist.name}
                      sizeClassName="w-9 h-9"
                    />
                    <div className="font-medium text-[#111] truncate">{artist.name}</div>
                  </div>
                  <div className="text-[10px] text-[#666] truncate mt-0.5">
                    {artist.genre || 'No genre'}
                  </div>
                  <div className="text-[10px] text-[#888] truncate mt-1">
                    {artist.category ? artist.category.charAt(0).toUpperCase() + artist.category.slice(1) : ''}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
