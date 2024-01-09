import { useEffect, useState, useRef } from "react";
import { authenticateCeramic } from "../../utils";
import { useCeramicContext } from "../context";
import { PostProps } from "../../utils/types";
import { Message } from "@/components/message";
import { Profile } from "../../utils/types";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";
import seedrandom from "seedrandom";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { CeramicDeveloper, CeramicDeveloperResult } from "../../utils/types";
import { set } from "date-fns";

export const MessageList = () => {
  const clients = useCeramicContext();
  const [posts, setPosts] = useState<PostProps[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [body, setBody] = useState("");
  const [context, setContext] = useState<CeramicDeveloperResult>();
  const { ceramic, composeClient } = clients;
  const [write, setWrite] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<CeramicDeveloper[] | undefined>();
  const messageRef = useRef<HTMLDivElement>(null);

  const getContext = async () => {
    setLoading(true);
    await authenticateCeramic(ceramic, composeClient);
    const existingContext = await composeClient.executeQuery<{
      viewer: {
        ceramicDev: {
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
      };
    }>(`
        query {
          viewer {
            ceramicDev {
              id
              developer {
                id
              }
              languages {
                  JavaScript
                  Python
                  Rust
                  Java
                  Swift
                  Go
                  Cpp
                  Scala
                  WebAssembly
                  Solidity
                  Other
              }
              attestations(first: 100) {
                edges {
                  node {
                    id
                    attester {
                      id
                    }
                    signal
                  }
                }
              }
            }
          }
        }
      `);
    console.log(existingContext);
    if (existingContext?.data?.viewer?.ceramicDev !== undefined) {
      setContext(existingContext?.data?.viewer?.ceramicDev);
    }
    setLoading(false);
  };

  /*
  Get only messages relevant to the user and the bot using filters
  */
  const getProfilesQuery = async () => {
    const profiles = await composeClient.executeQuery<{
      ceramicDevIndex: {
        edges: {
          node: {
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
              };
            };
          };
        }[];
      };
    }>(`
      query  {
        ceramicDevIndex(last: 100){
          edges{
            node{
              id
              developer{
                id
              }
              languages{
                JavaScript
                Python
                Rust
                Java
                Swift
                Go
                Cpp
                Scala
                WebAssembly
                Solidity
                Other
              }
              attestations(first: 100){
                edges{
                  node{
                    id
                    attester{
                      id
                    }
                    signal
                  }
                }
              }
            }
          }
        }
      }
    `);

    console.log(profiles);
    if (profiles?.data?.ceramicDevIndex?.edges) {
      const newProfiles = profiles?.data?.ceramicDevIndex?.edges.map(
        (edge) => ({
          id: edge.node.id,
          developer: edge.node.developer,
          languages: edge.node.languages,
          // @ts-ignore
          attestations: edge.node.attestations.edges.map((edge: any) => ({
            id: edge.node.id,
            attester: edge.node.attester,
            signal: edge.node.signal,
          })),
        })
      );
      console.log(newProfiles);
      setProfiles(newProfiles);
    }
  };

  const createAttestation = async (thisProfile: string) => {
      await authenticateCeramic(ceramic, composeClient);
      const attest = await composeClient.executeQuery<{
        createAttestToDev: {
          document: {
            id: string;
            attester: {
              id: string;
            };
            attestedProfileId: string;
            signal: boolean;
          };
        };
      }>(`
        mutation {
          createAttestToDev(input: {
            content: {
              attestedProfileId: "${thisProfile}"
              signal: true
            }
          })
          {
            document {
              id
              attester {
                id
              }
              attestedProfileId
              signal
            }
          }
        }
      `);
      console.log(attest);
      if (attest.data?.createAttestToDev?.document?.id) {
        const createdAttestation = {
          id: attest.data?.createAttestToDev?.document?.id,
          attester: attest.data?.createAttestToDev?.document?.attester,
          attestedProfileId:
            attest.data?.createAttestToDev?.document?.attestedProfileId,
          signal: attest.data?.createAttestToDev?.document?.signal,
        };
        console.log(createdAttestation);
       await getProfilesQuery();
      }
  };


  useEffect(() => {
    getContext();
    getProfilesQuery();
  }, []);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [posts, write]);

  return (
    <>
      <div className="flex-1 overflow-y-scroll no-scrollbar p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex flex-col w-full space-y-3 overflow-y-scroll no-scrollbar">
              {profiles !== undefined &&
                profiles.length &&
                profiles.map((prof) => <Message key={prof?.id} node={prof} func={createAttestation} />)}
              <div ref={messageRef}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white/5 border-t border-[#363739]">
        <div className="max-w-4xl mx-auto">
          <form
            onClick={async (e) => {
              e.preventDefault();
              // if (body) {
              //   console.log(body);
              //   const resultPost = await createPost(body);
              //   if (resultPost) {
              //     setPosts([...posts, resultPost]);
              //   }
              //   if (resultPost) {
              //     await triggerResponse(body, resultPost);
              //   }
              //   setBody("");
              // }
            }}
            className="flex items-center space-x-3"
          >
            <input
              autoFocus
              id="message"
              name="message"
              placeholder="Write a message..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="flex-1 h-12 px-3 rounded bg-[#222226] border border-[#222226] focus:border-[#222226] focus:outline-none text-white placeholder-white"
            />
            <button
              type="submit"
              className="bg-[#222226] rounded h-12 font-medium text-white w-24 text-lg border border-transparent hover:bg-[#363739] transition"
              disabled={!body || !ceramic.did}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
