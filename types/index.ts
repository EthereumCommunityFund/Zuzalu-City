export type IconProps = {
  size?: number;
  color?: string;
};

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: string;
  tagline?: string;
  image_url?: string;
  external_url?: string;
  meeting_url?: string;
  profileId?: string;
  spaceId?: string;
  participant_count: number;
  min_participant: number;
  max_participant: number;
  createdAt: string;
}

export interface EventEdge {
  node: Event;
}

export interface EventData {
  eventIndex: {
    edges: EventEdge[];
  };
}

export interface Space {
  id: string;
  avatar?: string;
  banner?: string;
  description: string;
  name: string;
  profileId?: string;
  tagline: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  nostr?: string;
  lens?: string;
  github?: string;
  discord?: string;
  ens?: string;
}

export interface SpaceEdge {
  node: Space;
}

export interface SpaceData {
  spaceIndex: {
    edges: SpaceEdge[];
  };
}

export interface Session {
  id: string;
  title: string;
  createdAt: string;
  profileId: string;
  startTime: string;
  endTime: string;
  eventId: string;
  tags?: string;
  type?: string;
  track?: string;
  format?: string;
  status?: string;
  tagline?: string;
  timezone?: string;
  video_url?: string;
  description?: string;
  meeting_url?: string;
  experience_level?: string;
}

export interface SessionEdge {
  node: Session;
}

export interface SessionData {
  sessionIndex: {
    edges: SessionEdge[];
  }
}
