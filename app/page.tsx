'use client';

import React, { useState, useEffect } from 'react';
import {
  Artist,
  Release,
  Achievement,
  ArtworkEntry,
  LyricsDocument,
  NoteDocument,
  FeaturePerson,
  TypeBeatSample,
  ArtworkIdea,
  MusicVideoIdea,
  CustomMiscEntry,
  MoodboardFolder,
  MoodboardItem,
  BackupLog,
} from '../lib/types';
import { AppDataStore, loadAppData, saveAppData } from '../lib/db';
import { TopNav, ActivePage } from '../components/TopNav';
import { AudioPlayer, AudioPlaybackState } from '../components/AudioPlayer';
import { HomeView } from '../components/HomeView';
import { AddArtistView } from '../components/AddArtistView';
import { ProfileView } from '../components/ProfileView';
import { AchievementsView } from '../components/AchievementsView';
import { ReleasesView } from '../components/ReleasesView';
import { ArtworksView } from '../components/ArtworksView';
import { LyricsView } from '../components/LyricsView';
import { DiscographyView } from '../components/DiscographyView';
import { FeaturesView } from '../components/FeaturesView';
import { NotesView } from '../components/NotesView';
import { MiscView } from '../components/MiscView';
import { BackupView } from '../components/BackupView';
import { UniversalSearch } from '../components/UniversalSearch';

const INITIAL_DATA: AppDataStore = {
  artists: [],
  releases: [],
  achievements: [],
  artworks: [],
  lyrics: [],
  notes: [],
  features: [],
  typeBeats: [],
  artworkIdeas: [],
  videoIdeas: [],
  miscCustom: [],
  moodboardFolders: [],
  moodboardItems: [],
  backupLogs: [],
  customGenres: {},
};

export default function Home() {
  const [appData, setAppData] = useState<AppDataStore>(INITIAL_DATA);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [audioPlayback, setAudioPlayback] = useState<AudioPlaybackState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    async function init() {
      const stored = await loadAppData();
      if (stored && stored.artists) {
        const cleanArtists = stored.artists.filter((a) => a.id !== 'art_initial_1');
        const cleanReleases = (stored.releases || []).filter((r) => r.artistId !== 'art_initial_1');
        const cleanAchievements = (stored.achievements || []).filter((a) => a.artistId !== 'art_initial_1');
        const cleanArtworks = (stored.artworks || []).filter((a) => a.artistId !== 'art_initial_1');
        const cleanLyrics = (stored.lyrics || []).filter((l) => l.artistId !== 'art_initial_1');
        const cleanNotes = (stored.notes || []).filter((n) => n.artistId !== 'art_initial_1');
        const cleanLogs = (stored.backupLogs || []).filter((l) => l.artistId !== 'art_initial_1');
        const cleanedData: AppDataStore = {
          ...stored,
          artists: cleanArtists,
          releases: cleanReleases,
          achievements: cleanAchievements,
          artworks: cleanArtworks,
          lyrics: cleanLyrics,
          notes: cleanNotes,
          backupLogs: cleanLogs,
        };
        setAppData(cleanedData);
        saveAppData(cleanedData);
      } else {
        await saveAppData(INITIAL_DATA);
      }
      setIsLoaded(true);
    }
    init();
  }, []);

  // Sync state mutations
  const updateAppData = (updater: (prev: AppDataStore) => AppDataStore) => {
    setAppData((prev) => {
      const next = updater(prev);
      saveAppData(next);
      return next;
    });
  };

  // Artist mutations
  const handleAddArtist = (newArtist: Artist) => {
    updateAppData((prev) => ({
      ...prev,
      artists: [...prev.artists, newArtist],
    }));
    setSelectedArtist(newArtist);
    setActivePage('profile');
  };

  const handleUpdateArtist = (updated: Artist) => {
    updateAppData((prev) => ({
      ...prev,
      artists: prev.artists.map((a) => (a.id === updated.id ? updated : a)),
    }));
    setSelectedArtist(updated);
  };

  const handleDeleteArtist = (artistId: string) => {
    updateAppData((prev) => ({
      ...prev,
      artists: prev.artists.filter((a) => a.id !== artistId),
      releases: prev.releases.filter((r) => r.artistId !== artistId),
      achievements: prev.achievements.filter((a) => a.artistId !== artistId),
      lyrics: prev.lyrics.filter((l) => l.artistId !== artistId),
      artworks: prev.artworks.filter((art) => art.artistId !== artistId),
    }));
    setSelectedArtist(null);
    setActivePage('home');
  };

  // Releases mutations
  const handleAddRelease = (release: Release) => {
    updateAppData((prev) => {
      const updated = {
        ...prev,
        releases: [release, ...prev.releases],
      };
      // Auto-aggregate artwork into artworks list
      if (release.artworkUrl || release.artworkFileId) {
        const artEntry: ArtworkEntry = {
          id: 'art_auto_' + release.id,
          artistId: release.artistId,
          title: `${release.title} Artwork`,
          imageUrl: release.artworkUrl,
          imageFileId: release.artworkFileId,
          sourceReleaseId: release.id,
          sourceType: 'release',
          createdAt: new Date().toISOString(),
        };
        updated.artworks = [artEntry, ...prev.artworks];
      }
      return updated;
    });
  };

  const handleUpdateRelease = (release: Release) => {
    updateAppData((prev) => ({
      ...prev,
      releases: prev.releases.map((r) => (r.id === release.id ? release : r)),
    }));
  };

  const handleDeleteRelease = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      releases: prev.releases.filter((r) => r.id !== id),
    }));
  };

  // Achievements mutations
  const handleAddAchievement = (ach: Achievement) => {
    updateAppData((prev) => ({
      ...prev,
      achievements: [ach, ...prev.achievements],
    }));
  };

  const handleUpdateAchievement = (ach: Achievement) => {
    updateAppData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((a) => (a.id === ach.id ? ach : a)),
    }));
  };

  const handleDeleteAchievement = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
    }));
  };

  // Artworks mutations
  const handleAddArtwork = (art: ArtworkEntry) => {
    updateAppData((prev) => ({
      ...prev,
      artworks: [art, ...prev.artworks],
    }));
  };

  const handleDeleteArtwork = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      artworks: prev.artworks.filter((a) => a.id !== id),
    }));
  };

  // Lyrics mutations
  const handleAddLyrics = (lyrics: LyricsDocument) => {
    updateAppData((prev) => ({
      ...prev,
      lyrics: [lyrics, ...prev.lyrics],
    }));
  };

  const handleUpdateLyrics = (lyrics: LyricsDocument) => {
    updateAppData((prev) => ({
      ...prev,
      lyrics: prev.lyrics.map((l) => (l.id === lyrics.id ? lyrics : l)),
    }));
  };

  const handleDeleteLyrics = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      lyrics: prev.lyrics.filter((l) => l.id !== id),
    }));
  };

  // Notes mutations
  const handleAddNote = (note: NoteDocument) => {
    updateAppData((prev) => ({
      ...prev,
      notes: [note, ...prev.notes],
    }));
  };

  const handleUpdateNote = (note: NoteDocument) => {
    updateAppData((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === note.id ? note : n)),
    }));
  };

  const handleDeleteNote = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  };

  // Features mutations
  const handleAddFeature = (p: FeaturePerson) => {
    updateAppData((prev) => ({
      ...prev,
      features: [p, ...prev.features],
    }));
  };

  const handleUpdateFeature = (p: FeaturePerson) => {
    updateAppData((prev) => ({
      ...prev,
      features: prev.features.map((f) => (f.id === p.id ? p : f)),
    }));
  };

  const handleDeleteFeature = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f.id !== id),
    }));
  };

  // Miscellaneous mutations
  const handleAddBeat = (b: TypeBeatSample) => {
    updateAppData((prev) => ({
      ...prev,
      typeBeats: [b, ...prev.typeBeats],
    }));
  };

  const handleDeleteBeat = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      typeBeats: prev.typeBeats.filter((b) => b.id !== id),
    }));
  };

  const handleAddArtworkIdea = (ai: ArtworkIdea) => {
    updateAppData((prev) => ({
      ...prev,
      artworkIdeas: [ai, ...prev.artworkIdeas],
    }));
  };

  const handleDeleteArtworkIdea = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      artworkIdeas: prev.artworkIdeas.filter((ai) => ai.id !== id),
    }));
  };

  const handleAddVideoIdea = (vi: MusicVideoIdea) => {
    updateAppData((prev) => ({
      ...prev,
      videoIdeas: [vi, ...prev.videoIdeas],
    }));
  };

  const handleDeleteVideoIdea = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      videoIdeas: prev.videoIdeas.filter((vi) => vi.id !== id),
    }));
  };

  const handleAddCustomEntry = (c: CustomMiscEntry) => {
    updateAppData((prev) => ({
      ...prev,
      miscCustom: [c, ...prev.miscCustom],
    }));
  };

  const handleDeleteCustomEntry = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      miscCustom: prev.miscCustom.filter((ci) => ci.id !== id),
    }));
  };

  const handleAddFolder = (f: MoodboardFolder) => {
    updateAppData((prev) => ({
      ...prev,
      moodboardFolders: [...prev.moodboardFolders, f],
    }));
  };

  const handleDeleteFolder = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      moodboardFolders: prev.moodboardFolders.filter((f) => f.id !== id),
      moodboardItems: prev.moodboardItems.filter((it) => it.folderId !== id),
    }));
  };

  const handleAddItemToFolder = (item: MoodboardItem) => {
    updateAppData((prev) => ({
      ...prev,
      moodboardItems: [item, ...prev.moodboardItems],
    }));
  };

  const handleDeleteItemFromFolder = (id: string) => {
    updateAppData((prev) => ({
      ...prev,
      moodboardItems: prev.moodboardItems.filter((it) => it.id !== id),
    }));
  };

  // Custom Genre handling
  const handleAddCustomGenre = (genre: string, subGenre?: string) => {
    updateAppData((prev) => {
      const current = prev.customGenres || {};
      const normGenre = genre.trim().toLowerCase();
      const existingSub = current[normGenre] || [];
      const updatedSub = subGenre ? Array.from(new Set([...existingSub, subGenre.trim().toLowerCase()])) : existingSub;
      return {
        ...prev,
        customGenres: {
          ...current,
          [normGenre]: updatedSub,
        },
      };
    });
  };

  // Import artist backup integration
  const handleImportArtistData = (imported: {
    artist: Artist;
    releases: Release[];
    achievements: Achievement[];
    lyrics: LyricsDocument[];
    notes: NoteDocument[];
    artworks: ArtworkEntry[];
  }) => {
    updateAppData((prev) => ({
      ...prev,
      artists: [...prev.artists.filter((a) => a.id !== imported.artist.id), imported.artist],
      releases: [...prev.releases.filter((r) => r.artistId !== imported.artist.id), ...imported.releases],
      achievements: [
        ...prev.achievements.filter((a) => a.artistId !== imported.artist.id),
        ...imported.achievements,
      ],
      lyrics: [...prev.lyrics.filter((l) => l.artistId !== imported.artist.id), ...imported.lyrics],
      notes: [...prev.notes.filter((n) => n.artistId !== imported.artist.id), ...imported.notes],
      artworks: [...prev.artworks.filter((art) => art.artistId !== imported.artist.id), ...imported.artworks],
    }));
    setSelectedArtist(imported.artist);
    setActivePage('profile');
  };

  // Existing labels
  const existingLabels = Array.from(
    new Set(appData.artists.map((a) => a.label).filter(Boolean))
  );

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white text-[#111] p-4 text-xs font-mono">
        loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#111] flex flex-col font-sans selection:bg-[#111] selection:text-white">
      {/* 1. Audio player at the top (if playing) */}
      <AudioPlayer
        currentTrack={audioPlayback}
        onClose={() => setAudioPlayback(null)}
      />

      {/* 2. Top navigation with controls */}
      <TopNav
        activePage={activePage}
        onNavigate={(page) => {
          if (page === 'artists') {
            setSelectedArtist(null);
            setActivePage('home');
          } else {
            setActivePage(page);
          }
        }}
        selectedArtist={selectedArtist}
        onSelectArtist={(artist) => {
          setSelectedArtist(artist);
          if (artist) setActivePage('profile');
          else setActivePage('home');
        }}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* 3. Dedicated Page View */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* HOME VIEW (A blank page with only the 3 buttons specified) */}
        {activePage === 'home' && !selectedArtist && (
          <HomeView
            artists={appData.artists}
            hasData={appData.artists.length > 0 || appData.releases.length > 0}
            onOpenExportImport={() => setActivePage('export-import')}
            onAddArtist={() => setActivePage('add-artist')}
            onSelectArtist={(artist) => {
              setSelectedArtist(artist);
              setActivePage('profile');
            }}
            onOpenSearch={() => setSearchOpen(true)}
          />
        )}

        {/* ADD ARTIST */}
        {activePage === 'add-artist' && (
          <AddArtistView
            onSave={handleAddArtist}
            onCancel={() => {
              if (selectedArtist) setActivePage('profile');
              else setActivePage('home');
            }}
            existingLabels={existingLabels}
            customGenres={appData.customGenres || {}}
            onAddCustomGenre={handleAddCustomGenre}
          />
        )}

        {/* PROFILE */}
        {activePage === 'profile' && selectedArtist && (
          <ProfileView
            artist={selectedArtist}
            onUpdate={handleUpdateArtist}
            onDelete={handleDeleteArtist}
            existingLabels={existingLabels}
            customGenres={appData.customGenres || {}}
            onAddCustomGenre={handleAddCustomGenre}
          />
        )}

        {/* RELEASES */}
        {activePage === 'release' && selectedArtist && (
          <ReleasesView
            artistId={selectedArtist.id}
            isReleasedFilter={true}
            releases={appData.releases}
            onAddRelease={handleAddRelease}
            onUpdateRelease={handleUpdateRelease}
            onDeleteRelease={handleDeleteRelease}
            onPlayAudio={(audio) => setAudioPlayback(audio)}
            customGenres={appData.customGenres || {}}
            onAddCustomGenre={handleAddCustomGenre}
          />
        )}

        {/* UNRELEASED */}
        {activePage === 'unreleased' && selectedArtist && (
          <ReleasesView
            artistId={selectedArtist.id}
            isReleasedFilter={false}
            releases={appData.releases}
            onAddRelease={handleAddRelease}
            onUpdateRelease={handleUpdateRelease}
            onDeleteRelease={handleDeleteRelease}
            onPlayAudio={(audio) => setAudioPlayback(audio)}
            customGenres={appData.customGenres || {}}
            onAddCustomGenre={handleAddCustomGenre}
          />
        )}

        {/* ACHIEVEMENTS */}
        {activePage === 'achievements' && selectedArtist && (
          <AchievementsView
            artistId={selectedArtist.id}
            achievements={appData.achievements}
            releases={appData.releases}
            notes={appData.notes}
            onAdd={handleAddAchievement}
            onUpdate={handleUpdateAchievement}
            onDelete={handleDeleteAchievement}
          />
        )}

        {/* ARTWORKS */}
        {activePage === 'artworks' && selectedArtist && (
          <ArtworksView
            artistId={selectedArtist.id}
            artworks={appData.artworks}
            onAddArtwork={handleAddArtwork}
            onDeleteArtwork={handleDeleteArtwork}
          />
        )}

        {/* LYRICS */}
        {activePage === 'lyrics' && selectedArtist && (
          <LyricsView
            artistId={selectedArtist.id}
            lyricsList={appData.lyrics}
            onAddLyrics={handleAddLyrics}
            onUpdateLyrics={handleUpdateLyrics}
            onDeleteLyrics={handleDeleteLyrics}
          />
        )}

        {/* DISCOGRAPHY */}
        {activePage === 'discography' && selectedArtist && (
          <DiscographyView
            artistId={selectedArtist.id}
            releases={appData.releases}
            onPlayAudio={(audio) => setAudioPlayback(audio)}
          />
        )}

        {/* FEATURES */}
        {activePage === 'features' && (
          <FeaturesView
            features={appData.features}
            onAdd={handleAddFeature}
            onUpdate={handleUpdateFeature}
            onDelete={handleDeleteFeature}
          />
        )}

        {/* NOTES */}
        {activePage === 'notes' && selectedArtist && (
          <NotesView
            artistId={selectedArtist.id}
            notesList={appData.notes}
            onAddNote={handleAddNote}
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {/* MISCELLANEOUS */}
        {activePage === 'miscellaneous' && (
          <MiscView
            typeBeats={appData.typeBeats}
            artworkIdeas={appData.artworkIdeas}
            videoIdeas={appData.videoIdeas}
            miscCustom={appData.miscCustom}
            moodboardFolders={appData.moodboardFolders}
            moodboardItems={appData.moodboardItems}
            onAddBeat={handleAddBeat}
            onDeleteBeat={handleDeleteBeat}
            onAddArtworkIdea={handleAddArtworkIdea}
            onDeleteArtworkIdea={handleDeleteArtworkIdea}
            onAddVideoIdea={handleAddVideoIdea}
            onDeleteVideoIdea={handleDeleteVideoIdea}
            onAddCustomEntry={handleAddCustomEntry}
            onDeleteCustomEntry={handleDeleteCustomEntry}
            onAddFolder={handleAddFolder}
            onDeleteFolder={handleDeleteFolder}
            onAddItemToFolder={handleAddItemToFolder}
            onDeleteItemFromFolder={handleDeleteItemFromFolder}
            onPlayAudio={(audio) => setAudioPlayback(audio)}
          />
        )}

        {/* EXPORT / IMPORT */}
        {activePage === 'export-import' && (
          <BackupView
            appData={appData}
            selectedArtist={selectedArtist}
            onUpdateAppData={(updated) => {
              setAppData(updated);
              saveAppData(updated);
            }}
            onImportArtistData={handleImportArtistData}
            onBack={() => {
              if (selectedArtist) setActivePage('profile');
              else setActivePage('home');
            }}
          />
        )}
      </main>

      {/* Universal search overlay — accessible from any page via the Search button in TopNav */}
      <UniversalSearch
        isOpen={searchOpen}
        artists={appData.artists}
        releases={appData.releases}
        achievements={appData.achievements}
        notes={appData.notes}
        lyrics={appData.lyrics}
        features={appData.features}
        onClose={() => setSearchOpen(false)}
        onSelectArtist={(artist) => {
          setSelectedArtist(artist);
          setActivePage('profile');
        }}
        onSelectRelease={(release) => {
          setSelectedArtist(appData.artists.find((a) => a.id === release.artistId) || null);
          setActivePage(release.isReleased ? 'release' : 'unreleased');
        }}
        onSelectAchievement={(artistId) => {
          setSelectedArtist(appData.artists.find((a) => a.id === artistId) || null);
          setActivePage('achievements');
        }}
        onSelectNote={() => {
          setActivePage('notes');
        }}
        onSelectLyrics={(artistId) => {
          setSelectedArtist(appData.artists.find((a) => a.id === artistId) || null);
          setActivePage('lyrics');
        }}
        onSelectFeature={() => {
          setSelectedArtist(null);
          setActivePage('features');
        }}
      />
    </div>
  );
}
