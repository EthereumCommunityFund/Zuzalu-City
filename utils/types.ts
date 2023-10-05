

export type ResolvedAttestation = {
  name: string
  uid: string
  currAccount: string;
}

declare global {
  interface Window {
    ethereum: any;
  }
}

export type Profile = {
  id?: any
  author?: {
    id: string
  }
  name?: string
  username?: string
  description?: string
  gender?: string
  emoji?: string
}

export type Posts = {
  edges: Array<{
    node: {
      body: string
      id: string
    }
  }>
}

export type PostProps = { 
  profile: Profile
  body: string
  id: string
  tag?: string
  created?: string
  authorId?: string
}

export type SidebarProps = {
  name?: string
  username?: string
  id?: string
}

export type Author = {
  id: string
  name: string
  username: string
  emoji: string
}

type Post = {
  body: string
  id: string
  tag?: string
  created?: string
}