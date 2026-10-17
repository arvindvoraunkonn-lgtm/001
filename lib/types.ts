export type SocialPlatform =
  | 'instagram'
  | 'x'
  | 'facebook'
  | 'spotify'
  | 'apple music'
  | 'mastodon'
  | 'bluesky'
  | 'youtube'
  | 'tiktok'
  | 'soundcloud'
  | 'bandcamp'
  | 'threads'
  | 'custom';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  customTitle?: string;
  url: string;
  username: string;
  bioUsed?: string;
  postCount?: number | string;
  otherMediaCount?: number | string;
  notes?: string;
}

export interface InspirationItem {
  id: string;
  artistName: string;
  url: string;
}

export interface Artist {
  id: string;
  name: string;
  actualName: string;
  biography: string;
  socialDob: string; // YYYY-MM-DD or text
  socials: SocialLink[];
  label: string;
  genre: string;
  subGenre: string;
  style: string;
  averageBpm: number | string;
  inspirations: InspirationItem[];
  category: 'independent' | 'dependent';
  distributor: string;
  wikipediaUrl?: string;
  // Responsive profile picture (square) and banner (wide) — CDN URL or local file in IndexedDB
  profileImageUrl?: string;
  profileImageFileId?: string;
  bannerImageUrl?: string;
  bannerImageFileId?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReleaseType = 'single' | 'album' | 'ep' | 'mixtape' | string;

export interface CreditItem {
  id: string;
  role: string; // lyricist, composer, additional composer, mixer, producer, custom
  name: string;
  profileUrls: string[];
  email?: string;
}

export interface TrackItem {
  id: string;
  trackNumber: number;
  title: string;
  artworkUrl?: string;
  artworkFileId?: string;
  audioFileId?: string;
  audioFileName?: string;
  audioUrl?: string;
  duration?: string;
  genre?: string;
  subGenre?: string;
  credits?: CreditItem[];
  beatType?: 'type beat' | 'custom produced' | 'cdn url' | 'bandlab' | 'none' | string;
  beatUrl?: string;
}

export interface Release {
  id: string;
  artistId: string;
  title: string;
  type: ReleaseType;
  isReleased: boolean; // released or unreleased
  releaseDate?: string;
  year?: string;
  genre: string;
  subGenre: string;
  artworkUrl?: string;
  artworkFileId?: string;
  // single specific
  hasFeatures?: boolean;
  featureNames?: string[];
  beatType?: 'type beat' | 'custom produced' | 'cdn url' | 'bandlab' | 'none' | string;
  beatUrl?: string;
  credits: CreditItem[];
  musicVideoDone?: boolean;
  musicVideoUploaded?: boolean;
  musicVideoKind?: 'visualiser' | 'music video' | 'video with artwork' | 'official release' | string;
  musicVideoUrl?: string;
  // album / ep / mixtape specific
  tracks: TrackItem[];
  trackCount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AchievementAttachment {
  id: string;
  // Local file stored in IndexedDB (image or any file type)
  fileId?: string;
  fileName?: string;
  fileType?: string; // MIME type, e.g. 'image/png', 'application/pdf'
  // OR an external URL (Google Drive link, Dropbox, etc.)
  url?: string;
  title?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  artistId: string;
  date: string; // YYYY-MM-DD or formatted
  title: string;
  note: string;
  // Optional attachments (local file or external URL)
  attachments?: AchievementAttachment[];
  // Optional link to a release that contributed to this achievement
  linkedReleaseId?: string;
  // Optional link to a specific track within that release
  linkedTrackId?: string;
  // Optional links to notes (note ids — notes can be shared across artists)
  linkedNoteIds?: string[];
  createdAt: string;
}

export interface ArtworkEntry {
  id: string;
  artistId?: string;
  title: string;
  imageUrl?: string;
  imageFileId?: string;
  sourceReleaseId?: string;
  sourceTrackId?: string;
  sourceType?: 'release' | 'track' | 'standalone';
  createdAt: string;
}

export interface LyricsDocument {
  id: string;
  artistId: string;
  fileName: string;
  lyrics: string;
  releaseId?: string;
  trackId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteDocument {
  id: string;
  artistId?: string; // empty means shared
  title: string;
  body: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturePerson {
  id: string;
  name: string;
  role: string; // artist, producer, music video director, mixer, etc.
  email?: string;
  socialLinks: string[];
  projectsWorkedOn: string[];
  notes?: string;
  createdAt: string;
}

export interface TypeBeatSample {
  id: string;
  title: string;
  url: string;
  artworkUrl?: string;
  artworkFileId?: string;
  colorTag?: string; // e.g. #ff3366 - the only place with color!
  lyricsStatus: 'available' | 'not available';
  lyricsText?: string;
  forArtist?: string; // pseudonymous artist
  createdAt: string;
}

export interface ArtworkIdea {
  id: string;
  title: string;
  url: string;
  notes?: string;
  createdAt: string;
}

export interface MusicVideoIdea {
  id: string;
  title: string;
  concept: string;
  referenceUrl?: string;
  createdAt: string;
}

export interface CustomMiscEntry {
  id: string;
  title: string;
  url: string;
  notes?: string;
  createdAt: string;
}

export interface MoodboardItem {
  id: string;
  folderId: string;
  title: string;
  type: 'youtube' | 'video' | 'image' | 'audio' | 'link' | 'note';
  url: string;
  notes?: string;
  createdAt: string;
}

export interface MoodboardFolder {
  id: string;
  name: string;
  createdAt: string;
}

export interface BackupLog {
  id: string;
  timestamp: string;
  type: 'artist' | 'meta';
  artistId?: string;
  artistName?: string;
  itemCounts: {
    artists?: number;
    releases?: number;
    achievements?: number;
    artworks?: number;
    lyrics?: number;
    notes?: number;
    features?: number;
    misc?: number;
  };
  notes?: string;
}

export interface MetaBackupData {
  version: number;
  exportedAt: string;
  logs: BackupLog[];
  artistSnapshots: {
    artistId: string;
    artistName: string;
    lastBackedUpAt: string;
    releaseCount: number;
    achievementsCount: number;
    lyricsCount: number;
    notesCount: number;
  }[];
}
