import React, { ReactNode, useEffect } from "react";
import { User, UserCredential, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";

export type AuthContextType = {
  user: User;
};

export const AuthContext = React.createContext<AuthContextType | {}>({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user: user }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
