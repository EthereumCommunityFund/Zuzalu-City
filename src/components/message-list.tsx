import { useEffect, useState, useRef } from "react";
import { authenticateCeramic } from "@/utils";
import { useCeramicContext } from "@/context";
import { Message } from "@/components/message";
import { CeramicDeveloper } from "@/types";

export const MessageList = () => {
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const [profiles, setProfiles] = useState<CeramicDeveloper[] | undefined>();
  const messageRef = useRef<HTMLDivElement>(null);

  /*
  Get last 100 profiles from the Ceramic Dev Index
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
  }, [profiles]);

  return (
    <>
      <div className="flex-1 overflow-y-scroll no-scrollbar p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex flex-col w-full space-y-3 overflow-y-scroll no-scrollbar">
              {profiles !== undefined &&
                profiles.length &&
                profiles.map((prof) => (
                  <Message
                    key={prof?.id}
                    node={prof}
                    func={createAttestation}
                  />
                ))}
              <div ref={messageRef}></div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white/5 border-t border-[#363739]">
        <div className="max-w-4xl mx-auto"></div>
      </div>
    </>
  );
};
