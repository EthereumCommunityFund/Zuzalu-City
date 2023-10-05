import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useCeramicContext } from "@/context";
import { authenticateCeramic, disconnect } from "../../utils";

type Props = {
  logged: boolean;
};

export function Header({ logged }: Props) {
  const { data: session } = useSession();
  const [loggedIn, setLoggedIn] = useState(false);
  const clients = useCeramicContext();
  const { ceramic, composeClient } = clients;

  const handleLogin = async () => {
    const accounts = await authenticateCeramic(ceramic, composeClient);
    if(accounts){
      setLoggedIn(true)
    }
    return accounts;
  };

  const handleDisconnect = async () => {
    await disconnect()
    return setLoggedIn(false);
  };

  useEffect(() => {
    if (localStorage.getItem("did")) {
      handleLogin();
    }
  }, []);

  return (
    <header className="p-6 bg-white/5 border-b border-[#363739]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <p className="inline-flex items-center space-x-3">
            <a
              href="https://grafbase.com?ref=chatbase"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                width="20"
                height="20"
                className="flex-shrink-0 h-6 w-6 fill-current text-white/50 hover:text-white/100 transition"
                viewBox="0 0 41 41"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.4873 0.875732C21.5804 1.06182 21.6359 1.26444 21.6507 1.47201C21.6655 1.67958 21.6393 1.88803 21.5735 2.08545C21.5077 2.28287 21.4037 2.46539 21.2673 2.62259C21.131 2.77978 20.965 2.90857 20.7788 3.0016L5.12736 10.8273L20.0897 18.3085L35.0492 10.8285L29.3335 7.97654L20.7879 12.2448C20.6013 12.342 20.3973 12.4011 20.1876 12.4186C19.978 12.4361 19.7669 12.4117 19.5668 12.3468C19.3667 12.2819 19.1815 12.1778 19.022 12.0405C18.8626 11.9033 18.732 11.7357 18.638 11.5475C18.5441 11.3592 18.4885 11.1542 18.4746 10.9443C18.4607 10.7344 18.4887 10.5238 18.557 10.3248C18.6254 10.1258 18.7326 9.94243 18.8726 9.78536C19.0126 9.62828 19.1824 9.50064 19.3722 9.4099L28.625 4.78803C28.8448 4.67832 29.087 4.62121 29.3326 4.62121C29.5782 4.62121 29.8204 4.67832 30.0402 4.78803L39.3027 9.40933C39.566 9.5408 39.7875 9.74302 39.9424 9.99331C40.0972 10.2436 40.1793 10.5321 40.1794 10.8264C40.1796 11.1207 40.0977 11.4093 39.943 11.6597C39.7884 11.9101 39.567 12.1125 39.3038 12.2442L20.8186 21.4868C20.5844 21.6039 20.3353 21.6574 20.0909 21.6545C19.8378 21.658 19.5877 21.6007 19.3614 21.4874L0.875635 12.2442C0.612505 12.1126 0.391221 11.9103 0.236568 11.66C0.0819143 11.4097 0 11.1213 0 10.827C0 10.5328 0.0819143 10.2444 0.236568 9.99412C0.391221 9.74383 0.612505 9.54153 0.875635 9.4099L19.3614 0.1673C19.7372 -0.0206339 20.1724 -0.0515769 20.571 0.0812772C20.9697 0.214131 21.2993 0.499902 21.4873 0.875732ZM0.19222 28.5978C0.28525 28.4117 0.414034 28.2457 0.571217 28.1093C0.7284 27.973 0.910905 27.8689 1.10831 27.803C1.30572 27.7372 1.51416 27.7109 1.72173 27.7256C1.9293 27.7403 2.13195 27.7958 2.31808 27.8888L20.0948 36.7778L37.8716 27.8888C38.2475 27.7009 38.6827 27.6699 39.0814 27.8029C39.4802 27.9358 39.8098 28.2216 39.9977 28.5975C40.1857 28.9735 40.2166 29.4087 40.0837 29.8074C39.9508 30.2061 39.665 30.5357 39.289 30.7237L20.8033 39.9663C20.5833 40.0763 20.3408 40.1335 20.0948 40.1335C19.8489 40.1335 19.6064 40.0763 19.3864 39.9663L0.900652 30.7237C0.714487 30.6306 0.548483 30.5018 0.412122 30.3445C0.275762 30.1873 0.171716 30.0047 0.105929 29.8072C0.040142 29.6098 0.0139019 29.4013 0.0287079 29.1937C0.0435138 28.9861 0.0990757 28.7834 0.19222 28.5973V28.5978Z"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.192691 19.3542C0.380675 18.9784 0.710247 18.6926 1.10892 18.5598C1.50758 18.4269 1.9427 18.4579 2.31855 18.6458L20.0953 27.5342L37.8721 18.6458C38.2472 18.4636 38.6791 18.4367 39.074 18.5708C39.4689 18.705 39.795 18.9894 39.9815 19.3624C40.1681 19.7355 40.2 20.167 40.0705 20.5634C39.9409 20.9599 39.6603 21.2892 39.2895 21.4801L20.8037 30.7227C20.5837 30.8326 20.3412 30.8897 20.0953 30.8897C19.8494 30.8897 19.6069 30.8326 19.3869 30.7227L0.901122 21.4801C0.525292 21.2921 0.239522 20.9626 0.106668 20.5639C-0.0261862 20.1652 0.00475674 19.7301 0.192691 19.3542Z"
                />
              </svg>
            </a>
            <button className="text-white font-bold text-xl" onClick={() => window.location.href = "/"}> Chatbase</button>
          </p>
          {loggedIn ? (
            <div className="flex space-x-1">
              {/* {session?.user?.image && (
                <div className="w-12 h-12 rounded overflow-hidden">
                  <Image
                    width={50}
                    height={50}
                    src={session?.user?.image}
                    alt={session?.user?.name || "User profile picture"}
                    title={session?.user?.name || "User profile picture"}
                  />
                </div>
              )} */}
              <button
                onClick={() => handleDisconnect()}
                className="bg-white/5 rounded h-12 px-6 font-medium text-white border border-transparent"
              >
                Sign out
              </button>
              <button
                onClick={() => window.location.href = "/profile"}
                className="bg-white/5 rounded h-12 px-6 font-medium text-white text-lg border border-transparent inline-flex items-center"
              >
                Edit Profile
              </button>
              <button
                onClick={() => window.location.href = "/context"}
                className="bg-white/5 rounded h-12 px-6 font-medium text-white text-lg border border-transparent inline-flex items-center"
              >
                Create Context
              </button>
            </div>
          ) : (
            <div className="flex items-center">
              <button
                onClick={async() => handleLogin()}
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
