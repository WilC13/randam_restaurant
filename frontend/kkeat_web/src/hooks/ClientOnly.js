import { createContext, useContext, useState, useEffect } from "react";

const ClientOnlyContext = createContext(false);

export const ClientOnlyProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(typeof window !== "undefined");
  }, []);

  return (
    <ClientOnlyContext.Provider value={isClient}>
      {children}
    </ClientOnlyContext.Provider>
  );
};

export const useClientOnly = () => useContext(ClientOnlyContext);
