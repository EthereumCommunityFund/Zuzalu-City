import { useState, useEffect } from "react";
import { authenticateCeramic } from "../../utils";
import { useCeramicContext } from "../context";
import seedrandom from "seedrandom";
import { Profile } from "../../utils/types";
import { Ed25519Provider } from "key-did-provider-ed25519";
import styles from "../styles/profile.module.scss";
import KeyResolver from "key-did-resolver";
import { DID } from "dids";

export const Userform = () => {
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const [profile, setProfile] = useState<Profile | undefined>();
  const [robotProfile, setRobotProfile] = useState<Profile | undefined>();
  const [robotDID, setRobotDID] = useState<DID | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [robotLoading, setRobotLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    await authenticateCeramic(ceramic, composeClient);
    await getProfile();
  };

  const createRobotDID = async () => {
    const uniqueKey = localStorage.getItem("did");
    if(uniqueKey){
      const rng = seedrandom(uniqueKey);
      const seed = new Uint8Array(32);
      for (let i = 0; i < 32; i += 1) {
        seed[i] = Math.floor(rng() * 256);
      }
      const staticDid = new DID({
        provider: new Ed25519Provider(seed),
        //@ts-ignore
        resolver: KeyResolver.getResolver(),
      });
      await staticDid.authenticate();
      //authenticate on ceramic instance
      composeClient.setDID(staticDid);
      ceramic.did = staticDid;
      setRobotDID(staticDid);
      if(!localStorage.getItem("robotDID")) {
        localStorage.setItem("robotDID", staticDid.id);
      }
      return staticDid;
    }
  };

  const getProfile = async () => {
    setLoading(true);
    if (ceramic.did !== undefined) {
      const profile = await composeClient.executeQuery<{
        viewer: { basicProfile: Profile };
      }>(`
        query {
          viewer {
            basicProfile {
              id
              name
              username
              description
              gender
              emoji
            }
          }
        }
      `);
      if (profile?.data?.viewer?.basicProfile !== null) {
        setProfile(profile?.data?.viewer?.basicProfile);
      }
      setLoading(false);
      console.log(profile);
    }
  };

  const getRobotProfile = async () => {
    setLoading(true);
    await createRobotDID();
    const profile = await composeClient.executeQuery<{
      viewer: { basicProfile: Profile };
    }>(`
      query {
        viewer {
          basicProfile {
            id
            name
            username
            description
            gender
            emoji
          }
        }
      }
      `);
    console.log(profile);
    if (profile?.data?.viewer?.basicProfile !== null) {
      setRobotProfile(profile?.data?.viewer?.basicProfile);
    }
  };

  

  const updateProfile = async () => {
    setLoading(true);
    await authenticateCeramic(ceramic, composeClient);
    if (ceramic.did !== undefined) {
      const update = await composeClient.executeQuery(`
        mutation {
          createBasicProfile(input: {
            content: {
              name: "${profile?.name}"
              username: "${profile?.username}"
              description: "${profile?.description}"
              gender: "${profile?.gender}"
              emoji: "${profile?.emoji}"
            }
          }) 
          {
            document {
              name
              username
              description
              gender
              emoji
            }
          }
        }
      `);
      if (update.errors) {
        alert(update.errors);
      } else {
        alert("Updated profile.");
        setLoading(true);
        const updatedProfile = await composeClient.executeQuery<{
          viewer: { basicProfile: Profile };
        }>(`
        query {
          viewer {
            basicProfile {
              id
              name
              username
              description
              gender
              emoji
            }
          }
        }
      `);
        setProfile(updatedProfile?.data?.viewer?.basicProfile);
        const followSelf = await composeClient.executeQuery(`
        mutation {
          createFollowing(input: {
            content: {
              profileId: "${updatedProfile?.data?.viewer?.basicProfile.id}"
            }
          }) 
          {
            document {
              profileId
            }
          }
        }
      `);
        console.log(followSelf);
      }
      setLoading(false);
    }
  };

  const updateRobotProfile = async () => {
    setRobotLoading(true);
    if (robotDID !== undefined) {
      await robotDID.authenticate();
      //authenticate on ceramic instance
      composeClient.setDID(robotDID);
      ceramic.did = robotDID;
      const update = await composeClient.executeQuery(`
        mutation {
          createBasicProfile(input: {
            content: {
              name: "${robotProfile?.name}"
              username: "${robotProfile?.username}"
              description: "${robotProfile?.description}"
              gender: "${robotProfile?.gender}"
              emoji: "${robotProfile?.emoji}"
            }
          }) 
          {
            document {
              name
              username
              description
              gender
              emoji
            }
          }
        }
      `);
      if (update.errors) {
        alert(update.errors);
      } else {
        alert("Updated profile.");
        setRobotLoading(true);
        const updatedProfile = await composeClient.executeQuery<{
          viewer: { basicProfile: Profile };
        }>(`
        query {
          viewer {
            basicProfile {
              id
              name
              username
              description
              gender
              emoji
            }
          }
        }
      `);
        setRobotProfile(updatedProfile?.data?.viewer?.basicProfile);
        const followSelf = await composeClient.executeQuery(`
        mutation {
          createFollowing(input: {
            content: {
              profileId: "${updatedProfile?.data?.viewer?.basicProfile.id}"
            }
          }) 
          {
            document {
              profileId
            }
          }
        }
      `);
        console.log(followSelf);
      }
      setRobotLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
    createRobotDID();
    getRobotProfile();
  }, []);

  return (
    <div>
      {profile === undefined && ceramic.did === undefined ? (
        <div className="content">
          <button
            onClick={() => {
              handleLogin();
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <>
          <div className="content">
            <div className={styles.formGroup}>
              <div className="">
                <label className="">Name</label>
                <input
                  className=""
                  type="text"
                  defaultValue={profile?.name || ""}
                  onChange={(e) => {
                    setProfile({ ...profile, name: e.target.value });
                  }}
                />
              </div>
              <div className="">
                <label>Username</label>
                <input
                  type="text"
                  defaultValue={profile?.username || ""}
                  onChange={(e) => {
                    setProfile({ ...profile, username: e.target.value });
                  }}
                />
              </div>
              <div className="">
                <label>Description</label>
                <input
                  type="text"
                  defaultValue={profile?.description || ""}
                  onChange={(e) => {
                    setProfile({ ...profile, description: e.target.value });
                  }}
                />
              </div>
              <div className="">
                <label>Gender</label>
                <input
                  type="text"
                  defaultValue={profile?.gender || ""}
                  onChange={(e) => {
                    setProfile({ ...profile, gender: e.target.value });
                  }}
                />
              </div>
              <div className="">
                <label>Emoji</label>
                <input
                  type="text"
                  defaultValue={profile?.emoji || ""}
                  onChange={(e) => {
                    setProfile({ ...profile, emoji: e.target.value });
                  }}
                  maxLength={2}
                />
              </div>
              <div className="">
                <button
                  style={{ backgroundColor: "grey", borderRadius: "5px", padding: "5px", margin: "10% 0" }}
                  onClick={() => {
                    updateProfile();
                  }}
                >
                  {loading ? "Loading..." : "Update Profile"}
                </button>
              </div>
            </div>
          </div>
          <div className="content">
            <div className={styles.formGroup}>
              <div className="">
                <label className="">Name</label>
                <input
                  className=""
                  type="text"
                  defaultValue={robotProfile?.name || ""}
                  onChange={(e) => {
                    setRobotProfile({ ...robotProfile, name: e.target.value });
                  }}
                />
              </div>
              <div className="">
                <label>Username</label>
                <input
                  type="text"
                  defaultValue={robotProfile?.username || ""}
                  onChange={(e) => {
                    setRobotProfile({
                      ...robotProfile,
                      username: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="">
                <label>Description</label>
                <input
                  type="text"
                  defaultValue={robotProfile?.description || ""}
                  onChange={(e) => {
                    setRobotProfile({
                      ...robotProfile,
                      description: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="">
                <label>Gender</label>
                <input
                  type="text"
                  defaultValue={robotProfile?.gender || ""}
                  onChange={(e) => {
                    setRobotProfile({
                      ...robotProfile,
                      gender: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="">
                <label>Emoji</label>
                <input
                  type="text"
                  defaultValue={robotProfile?.emoji || ""}
                  onChange={(e) => {
                    setRobotProfile({ ...robotProfile, emoji: e.target.value });
                  }}
                  maxLength={2}
                />
              </div>
              <div className="">
                <button
                  style={{ backgroundColor: "grey", borderRadius: "5px", padding: "5px", margin: "10% 0"  }}
                  onClick={() => {
                    updateRobotProfile();
                  }}
                >
                  {robotLoading ? "Loading..." : "Update ChatBot Profile"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
