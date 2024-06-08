import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

interface AppContextTypes {
  openSidebar: boolean;
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextTypes>({
  openSidebar: false,
  setOpenSidebar: () => {},
});

const AppContextProvider = ({ children }: any) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <AppContext.Provider
      value={{
        openSidebar,
        setOpenSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;

export const useAppContext = () => useContext(AppContext);
