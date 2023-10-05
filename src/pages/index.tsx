import { useState, useEffect } from "react";
import { authenticateCeramic } from "../../utils";
import { Header } from "@/components/header";
import { MessageList } from "@/components/message-list";
import { useCeramicContext } from "@/context";
import { useChat, type Message } from "ai/react";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;

  const handleLogin = async () => {
    const accounts = await authenticateCeramic(ceramic, composeClient);
    if (accounts) {
      setLoggedIn(true);
    }
    return accounts;
  };

  useEffect(() => {
    if (localStorage.getItem("did")) {
      handleLogin();
    }
  }, []);

  return (
    <div className="flex flex-col bg-cover">
      <Header logged={loggedIn} />
      {loggedIn ? (
        <MessageList />
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
}
