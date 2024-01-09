import { useState, useEffect, useCallback } from "react";
import { useCeramicContext } from "@/context";
import { authenticateCeramic, disconnect } from "../../utils";

type Props = {
  logged: boolean;
};

export function Header({ logged }: Props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;

  const handleLogin = useCallback(async () => {
    const accounts = await authenticateCeramic(ceramic, composeClient);
    if (accounts) {
      setLoggedIn(true);
    }
    return accounts;
  }, [ceramic, composeClient]);

  useEffect(() => {
    if (localStorage.getItem("did")) {
      handleLogin();
    }
  }, [handleLogin]);

  const handleDisconnect = async () => {
    await disconnect();
    return setLoggedIn(false);
  };

  useEffect(() => {
    if (localStorage.getItem("did")) {
      handleLogin();
    }
  }, [handleLogin]);

  return (
    <header className="p-6 bg-white/5 border-b border-[#363739]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <p className="inline-flex items-center space-x-3">
            <a
              href="https://composedb.js.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://blog.ceramic.network/content/images/2020/11/ceramic-no-shadow.png"
                alt="ComposeDB"
                className="w-7 h-7"
              />
            </a>
            <button
              className="text-white font-bold text-xl"
              onClick={() => (window.location.href = "/")}
            >
              {" "}
              Ceramic Developer Application
            </button>
          </p>
          {loggedIn ? (
            <div className="flex space-x-1">
              <button
                onClick={async () => {
                  await handleDisconnect();
                  window.location.href = "/";
                }}
                className="bg-white/5 rounded h-12 px-6 font-medium text-white border border-transparent"
              >
                Sign Out
              </button>
              {/* <button
                onClick={() => (window.location.href = "/profile")}
                className="bg-white/5 rounded h-12 px-6 font-medium text-white text-lg border border-transparent inline-flex items-center"
              >
                Edit Profile
              </button>
              <button
                onClick={() => (window.location.href = "/context")}
                className="bg-white/5 rounded h-12 px-6 font-medium text-white text-lg border border-transparent inline-flex items-center"
              >
                Create Context
              </button> */}
            </div>
          ) : (
            <div className="flex items-center">
              <button
                onClick={async () => {
                  await handleLogin();
                  window.location.href = "/";
                }}
                className="bg-white/5 rounded h-12 px-6 font-medium text-white text-lg border border-transparent inline-flex items-center"
              >
                Sign in with MetaMask
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
