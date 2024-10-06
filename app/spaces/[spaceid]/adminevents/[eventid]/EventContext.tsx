import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Event } from '@/types';

interface EventContextType {
  event: Event | undefined;
  setEvent: React.Dispatch<React.SetStateAction<Event | undefined>>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [event, setEvent] = useState<Event | undefined>(undefined);

  return (
    <EventContext.Provider value={{ event, setEvent }}>
      {children}
    </EventContext.Provider>
  );
};
