export type ResolvedAttestation = {
  name: string;
  uid: string;
  currAccount: string;
};

declare global {
  interface Window {
    ethereum: any;
  }
}

export type Profile = {
  id?: any;
  author?: {
    id: string;
  };
  name?: string;
  username?: string;
  description?: string;
  gender?: string;
  emoji?: string;
};

export type Posts = {
  edges: Array<{
    node: {
      body: string;
      id: string;
    };
  }>;
};

export type CeramicDeveloperResult = {
  id: string;
  developer: {
    id: string;
  };
  languages: {
    JavaScript: boolean;
    Python: boolean;
    Rust: boolean;
    Java: boolean;
    Swift: boolean;
    Go: boolean;
    Cpp: boolean;
    Scala: boolean;
    WebAssembly: boolean;
    Solidity: boolean;
    Other: boolean;
  };
  attestations: {
    edges: {
      node: {
        id: string;
        attester: {
          id: string;
        };
        signal: string;
      };
    }[];
  };
};

export type CeramicDeveloper = {
  id: string;
  developer: {
    id: string;
  };
  languages: {
    JavaScript: boolean;
    Python: boolean;
    Rust: boolean;
    Java: boolean;
    Swift: boolean;
    Go: boolean;
    Cpp: boolean;
    Scala: boolean;
    WebAssembly: boolean;
    Solidity: boolean;
    Other: boolean;
  };
  attestations: [
    {
      id: string;
      attester: {
        id: string;
      };
      signal: string;
    }
  ];
};

export type PostProps = {
  profile: Profile;
  body: string;
  id: string;
  tag?: string;
  created?: string;
  authorId?: string;
};

export type ProfProps = {
  node: CeramicDeveloper;
  func: any;
}

export type SidebarProps = {
  name?: string;
  username?: string;
  id?: string;
};

export type Author = {
  id: string;
  name: string;
  username: string;
  emoji: string;
};

type Post = {
  body: string;
  id: string;
  tag?: string;
  created?: string;
};
