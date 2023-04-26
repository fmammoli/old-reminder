import React, { ReactNode, useEffect } from "react";
import { User } from "firebase/auth";
import { auth } from "@/firebase/clientApp";
import { useAuthUser } from "@react-query-firebase/auth";

export type AuthContextType = {
  user: User;
};

export const AuthContext = React.createContext<AuthContextType | {}>({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const user = useAuthUser(["user"], auth);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user: user }}>
      {children}
    </AuthContext.Provider>
  );
};
