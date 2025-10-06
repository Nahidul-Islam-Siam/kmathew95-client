"use client";
 
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSocket } from "./SocketProvider";
 
const AuthenticateProvider = ({ children }: { children: React.ReactNode }) => {
  const { authenticate, isConnected } = useSocket();
  const token = useSelector((state: RootState) => state?.auth.accessToken);
 
  useEffect(() => {
    const authenticateUser = async () => {
      if (isConnected && token) {
        await authenticate(token);
      } else if (!token) {
        console.warn("No token found for authentication");
      }
    };
 
    authenticateUser();
  }, [token, isConnected, authenticate]);
 
  return <div>{children}</div>;
};
 
export default AuthenticateProvider;