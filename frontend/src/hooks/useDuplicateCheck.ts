import { useState, useEffect } from 'react';
import { api } from '../api/items.api.js';

export interface DuplicateMatch {
  id: string;
  name: string;
  room_name: string;
  category: string;
  photo_url: string | null;
}

export function useDuplicateCheck(name: string) {
  const [duplicates, setDuplicates] = useState<DuplicateMatch[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setDuplicates([]);
      setIsChecking(false);
      return;
    }

    setIsChecking(true);
    // 300ms debounce [CA-3.1]
    const timer = setTimeout(async () => {
      try {
        const matches = await api.checkDuplicates(trimmed);
        setDuplicates(matches);
      } catch (err) {
        console.warn('Duplicate check error:', err);
      } finally {
        setIsChecking(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [name]);

  return { duplicates, isChecking };
}
