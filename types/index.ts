import { SwipeableDrawerProps } from '@mui/material';
import { CSSProperties, Dispatch, SetStateAction } from 'react';
import { ITimezoneOption } from 'react-timezone-select';

export type Anchor = 'top' | 'left' | 'bottom' | 'right';

export type IconProps = {
  size?: number;
  color?: string;
  cursor?: string;
};

export type Link = {
  title: string;
  links: string;
};
export interface Contract {
  type?: string;
  contractAddress?: string;
  description?: string;
  image_url?: string;
  status?: string;
}
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
  space?: {
    id?: string;
    name?: string;
    gated?: string;
    avatar?: string;
    banner?: string;
    description?: string;
  };
  profile?: {
    username?: string;
    avatar?: string;
  };
  customLinks?: [Link];
  tracks?: string;
  contractID?: number;
  contracts?: [Contract];
  admins?: {
    id: string;
  }[];
  members?: {
    id: string;
  }[];
  superAdmin?: {
    id: string;
  }[];
}

export interface EventEdge {
  node: Event;
}

export interface EventData {
  eventIndex: {
    edges: EventEdge[];
  };
}
export interface SpaceEventEdge {
  node: Event;
}

export interface CeramicResponseType<T> {
  data?: T;
}

export interface SpaceEventData {
  edges: SpaceEventEdge[];
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
  category?: string;
  members?: {
    id: string;
  }[];
  admins?: {
    id: string;
  }[];
  superAdmin?: {
    id: string;
  }[];
  events: {
    edges: {
      node: {
        startTime: string;
        endTime: string;
      };
    }[];
  };
}

export interface SpaceEdge {
  node: Space;
}

export interface SpaceData {
  spaceIndex: {
    edges: SpaceEdge[];
  };
}

type People = {
  id: string;
  mvpProfile: {
    avatar?: string;
    id: string;
    username: string;
  };
};

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
  timezone?: string;
  video_url?: string;
  description: string;
  meeting_url?: string;
  experience_level?: string;
  location?: string;
  speakers: string;
  organizers: string;
  rsvpNb?: number;
  creatorDID?: string;
  uuid: string;
}
export type SessionSupabaseData = {
  title: string;
  description?: string;
  experience_level?: string;
  createdAt: string;
  startTime: string | null;
  endTime: string | null;
  profileId: string;
  eventId: string;
  tags?: string;
  type?: string;
  format?: string;
  track?: string;
  timezone?: string;
  video_url?: string;
  location?: string;
  organizers?: string;
  speakers?: string;
  creatorDID: string;
  uuid: string;
};
export interface SessionEdge {
  node: Session;
}

export interface SessionData {
  sessionIndex: {
    edges: SessionEdge[];
  };
}

export interface Venue {
  id: string;
  name: string;
  eventId: string;
  tags: string;
  avatar: string;
  bookings: string;
  capacity: number;
}

export type Profile = {
  id: any;
  username: string;
  avatar?: string;
  author?: {
    id: string;
  };
};
export interface ProfileData {
  node: Profile;
}

export interface ProfileEdge {
  mVPProfileIndex: {
    edges: ProfileData[];
  };
}

export interface CreateProfileResult {
  profile?: Profile;
  error?: string;
}

export interface Coordinates {
  lat: number | undefined;
  lng: number | undefined;
}

export interface Tag {
  name: string;
  value: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Tag[];
}
export interface IProps {
  setIsVerify?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsAgree?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsMint?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsTransaction?: React.Dispatch<React.SetStateAction<boolean>> | any;
  setIsComplete?: React.Dispatch<React.SetStateAction<boolean>> | any;
  handleClose?: () => void;
  eventContractID?: number;
  setFilteredResults?: React.Dispatch<React.SetStateAction<any[]>>;
  filteredResults?: any[];
  event?: Event;
  tokenId?: string;
  setTokenId?: React.Dispatch<React.SetStateAction<string>> | any;
  ticketMinted?: any[];
  setTicketMinted?: React.Dispatch<React.SetStateAction<any[]>> | any;
}

export interface SocialLinks {
  title: string;
  links: string;
}

export interface CreateEventRequest {
  name: string;
  tagline: string;
  participant: number;
  max_participant: number;
  min_participant: number;
  external_url: string;
  strDesc: string;
  spaceId: string;
  profileId: string;
  avatarURL: string;
  startTime: string;
  endTime: string;
  socialLinks: SocialLinks[];
  adminId: string;
  tracks: string[];
  person: boolean;
  locations: string[];
  timezone: string;
}

export interface ZuAutoCompleteProps {
  optionVals: Array<{
    value: string;
    label: string;
  }>;
  val: Array<{
    value: string;
    label: string;
  }>;
  setVal: Dispatch<SetStateAction<{ value: string; label: string }[]>>;
}

export interface AddZupassMemberRequest {
  eventId: string;
  memberDID: string;
  memberZupass: string;
}
export interface AddMemberRequest {
  eventId: string;
  memberAddress: string;
}
export interface AddAdminRequest {
  eventId: string;
  adminAddress: string;
}

export type AvailableType = {
  startTime: string;
  endTime: string;
  error?: string;
};

export interface FilterSessionsPopComponentProps extends SwipeableDrawerProps {
  isRSVPFiltered: boolean;
  handleRSVPSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isManagedFiltered: boolean;
  handleManagedSwitchChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  location: string;
  track: string;
  handleClear: () => void;
}

export interface TimezoneSelectorProps {
  sx: CSSProperties;
  setSelectedTimezone: Dispatch<SetStateAction<ITimezoneOption>>;
}
