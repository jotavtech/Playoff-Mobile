export type RoomRole = 'host' | 'moderator' | 'participant';

export type RoomStatus = 'open' | 'locked' | 'closed';

export type Room = {
  id: string;
  code: string;
  name: string;
  hostId: string;
  status: RoomStatus;
  isPublic: boolean;
  createdAt: string;
};

export type RoomMember = {
  id: string;
  roomId: string;
  userId: string;
  role: RoomRole;
  joinedAt: string;
};

export type QueueItem = {
  id: string;
  roomId: string;
  track: import('./player').Track;
  addedBy: string;
  votes: number;
  position: number;
};

export type RoomRealtimeEvent =
  | 'ROOM_JOINED'
  | 'ROOM_LEFT'
  | 'SONG_ADDED'
  | 'SONG_REMOVED'
  | 'VOTE_UPDATED'
  | 'PLAYBACK_CHANGED'
  | 'ROOM_CLOSED';
