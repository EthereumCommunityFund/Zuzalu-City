import type { NextPage } from "next";
import { Header } from "@/components/header";
import { useState, useEffect } from "react";
import { useCeramicContext } from "@/context";
import { Profile } from "../../utils/types";
import { authenticateCeramic } from "../../utils";
import styles from "../styles/profile.module.scss";

const Context: NextPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;
  const [loading, setLoading] = useState<boolean>(false);
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [context, setContext] = useState<string>();
  const [id, setId] = useState<string>();
  const [profile, setProfile] = useState<Profile | undefined>();

  const handleLogin = async () => {
    const accounts = await authenticateCeramic(ceramic, composeClient);
    if (accounts) {
      setLoggedIn(true);
    } else {
      window.location.href = "/profile";
    }
    await getProfile();
    await getContext();
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
              author {
                id
              }
            }
          }
        }
      `);
      if (profile?.data?.viewer?.basicProfile !== null) {
        setProfile(profile?.data?.viewer?.basicProfile);
      }
      setId(profile?.data?.viewer?.basicProfile?.author?.id);
      if (profile?.data?.viewer?.basicProfile?.author?.id === undefined) {
        window.location.href = "/profile";
      }
      setLoading(false);
      console.log(profile);
    }
  };

  const getContext = async () => {
    setLoading(true);
    const existingContext = await composeClient.executeQuery<{
      contextIndex: {
        edges: { node: { id: string; context: string; authorId: string } }[];
      };
    }>(`
    query{
      contextIndex(
        filters: { 
          where: { 
            authorId: { 
              equalTo: "${localStorage.getItem("id")}" 
              } 
            } 
          }
        first: 1){
        edges{
          node{
            id
            context
            authorId
          }
        }
      }
    }
      `);
    console.log(existingContext);
    if (
      existingContext?.data?.contextIndex?.edges[0]?.node?.context !== undefined
    ) {
      setContext(existingContext?.data?.contextIndex?.edges[0]?.node?.context);
    }
    setLoading(false);
  };

  const updateContext = async () => {
    setLoading(true);
    await authenticateCeramic(ceramic, composeClient);
    if (ceramic.did !== undefined) {
      const update = await composeClient.executeQuery<{
        viewer: { context: string };
      }>(`
        mutation {
          createContext(input: {
            content: {
              context: "${context || ""}"
              authorId: "${localStorage.getItem("id")}"
            }
          }) 
          {
            document {
              id
              context
            }
          }
        }
      `);
      console.log(update);
      if (update.errors) {
        alert(update.errors);
      } else {
        alert("Updated context.");
        setLoading(true);
        if (update?.data?.viewer?.context !== undefined) {
          setContext(update?.data?.viewer?.context);
        }
      }
      setLoading(false);
    }
  };

  const resetContext = async () => {
    setResetLoading(true);
    await authenticateCeramic(ceramic, composeClient);
    if (ceramic.did !== undefined) {
      const update = await composeClient.executeQuery<{
        viewer: { context: string };
      }>(`
        mutation {
          createContext(input: {
            content: {
              context: "${""}"
              authorId: "${localStorage.getItem("id")}"
            }
          }) 
          {
            document {
              id
              context
            }
          }
        }
      `);
      console.log(update);
      if (update.errors) {
        alert(update.errors);
      } else {
        alert("Updated context.");
        setResetLoading(true);
      }
      setResetLoading(false);
    }
    getContext();
  };

  useEffect(() => {
    if (localStorage.getItem("did")) {
      handleLogin();
    }
  }, []);
  return (
    <div className="flex flex-col bg-cover">
      <Header logged={loggedIn} />
      <h1 className="text-2xl font-bold text-white text-center mt-6">
        Chatbot Context
      </h1>
      <br />
      <p className="text-md text-white text-center">
        Create context to pre-load for your chatbot
      </p>
      {loggedIn ? (
        <>
          <div className="flex-1 overflow-y-scroll no-scrollbar p-6">
            <div className={styles.contextGroup}>
              <textarea
                id="contextArea"
                className="w-1/2 h-1/2 p-2 border border-gray-300 rounded mt-1 overflow-y-hidden break-words color-black bg-gray-200"
                defaultValue={context}
                onChange={(e) => {
                  setContext(e.target.value);
                  if (e.target.value === "") {
                    setContext(" ");
                  }
                }}
              />
              <button
                style={{
                  backgroundColor: "lightgray",
                  borderRadius: "5px",
                  padding: "5px",
                  margin: "5% 0",
                  width: "15%",
                }}
                onClick={() => {
                  updateContext();
                }}
              >
                {loading ? "Loading..." : "Update Context"}
              </button>
              <button
                style={{
                  backgroundColor: "lightgray",
                  borderRadius: "5px",
                  padding: "5px",
                  margin: "2% 0",
                  width: "15%",
                }}
                onClick={() => {
                  resetContext();
                }}
              >
                {resetLoading ? "Loading..." : "Reset"}
              </button>
            </div>
          </div>
          <div className="p-6 bg-white/5 border-t border-[#363739]">
            <div className="max-w-4xl mx-auto"></div>
          </div>
        </>
      ) : (
        <div className="h-full flex items-center justify-center flex-col space-y-2.5">
          <>
            <p className="text-lg md:text-2xl lg:text-3xl font-medium text-white">
              Sign in with MetaMask to join the chat!
            </p>
            <p>
              <a
                href="https://composedb.js.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 transition hover:text-[#4a9c6d]/100"
              >
                Powered by ComposeDB &amp; OpenAI Live Queries
              </a>
            </p>
          </>
        </div>
      )}
    </div>
  );
};

export default Context;
