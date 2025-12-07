"use client";

import { useMeetings } from "@/hooks/useMeetings";
import { useContext, createContext, ReactNode } from "react";

type MeetingContextType = ReturnType<typeof useMeetings>;

const MeetingContext = createContext<MeetingContextType | null>(null);

export const useMeetingContext = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error("useMeetingContext must be used within a MeetingProvider");
  }
  return context;
};

interface MeetingProviderProps {
  children: ReactNode;
}

export const MeetingProvider = ({ children }: MeetingProviderProps) => {
  const meetingData = useMeetings();

  return (
    <MeetingContext.Provider value={meetingData}>
      {children}
    </MeetingContext.Provider>
  );
};
