import React, { createContext, useContext, useState } from 'react';
import { CategoryKey } from '../types/inventory.types.js';

interface ChainedAddContextType {
  lastRoomId: string;
  setLastRoomId: (id: string) => void;
  lastCategory: CategoryKey;
  setLastCategory: (cat: CategoryKey) => void;
  isChainedMode: boolean;
  setIsChainedMode: (val: boolean) => void;
}

const ChainedAddContext = createContext<ChainedAddContextType | undefined>(undefined);

export const ChainedAddProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastRoomId, setLastRoomIdState] = useState<string>(() => {
    return localStorage.getItem('pokedress_last_room') || '';
  });

  const [lastCategory, setLastCategoryState] = useState<CategoryKey>(() => {
    return (localStorage.getItem('pokedress_last_category') as CategoryKey) || 'dressing_vetements';
  });

  const [isChainedMode, setIsChainedMode] = useState<boolean>(true);

  const setLastRoomId = (id: string) => {
    setLastRoomIdState(id);
    if (id) localStorage.setItem('pokedress_last_room', id);
  };

  const setLastCategory = (cat: CategoryKey) => {
    setLastCategoryState(cat);
    if (cat) localStorage.setItem('pokedress_last_category', cat);
  };

  return (
    <ChainedAddContext.Provider
      value={{
        lastRoomId,
        setLastRoomId,
        lastCategory,
        setLastCategory,
        isChainedMode,
        setIsChainedMode,
      }}
    >
      {children}
    </ChainedAddContext.Provider>
  );
};

export function useChainedAdd() {
  const context = useContext(ChainedAddContext);
  if (!context) {
    throw new Error('useChainedAdd must be used within ChainedAddProvider');
  }
  return context;
}
