import { createContext, useContext, useState, useCallback } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const handleSetLoading = useCallback((value) => {
    setLoading(value);
  }, []);

  return (
    <LoadingContext.Provider value={{ loading, setLoading: handleSetLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
