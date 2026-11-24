import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';

interface Store {
  bookmarks: string[]; toggleBookmark: (s: string) => void;
  learned: string[]; toggleLearned: (s: string) => void;
  viewed: string[]; markViewed: (s: string) => void;
  recent: string[];
  notes: Record<string, string>; setNote: (s: string, t: string) => void;
  lessonsDone: string[]; toggleLesson: (id: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<Store | null>(null);
const toggle = (list: string[], s: string) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setB] = useLocalStorage<string[]>('gcm:bookmarks', []);
  const [learned, setL] = useLocalStorage<string[]>('gcm:learned', []);
  const [viewed, setV] = useLocalStorage<string[]>('gcm:viewed', []);
  const [recent, setR] = useLocalStorage<string[]>('gcm:recent', []);
  const [notes, setN] = useLocalStorage<Record<string, string>>('gcm:notes', {});
  const [lessonsDone, setLD] = useLocalStorage<string[]>('gcm:lessons', []);

  const value = useMemo<Store>(() => ({
    bookmarks, toggleBookmark: (s) => setB((p) => toggle(p, s)),
    learned, toggleLearned: (s) => setL((p) => toggle(p, s)),
    viewed, markViewed: (s) => {
      setV((p) => (p.includes(s) ? p : [...p, s]));
      setR((p) => [s, ...p.filter((x) => x !== s)].slice(0, 10));
    },
    recent,
    notes, setNote: (s, t) => setN((p) => {
      const n = { ...p };
      if (t.trim()) n[s] = t; else delete n[s];
      return n;
    }),
    lessonsDone, toggleLesson: (id) => setLD((p) => toggle(p, id)),
    resetAll: () => { setB([]); setL([]); setV([]); setR([]); setN({}); setLD([]); },
  }), [bookmarks, learned, viewed, recent, notes, lessonsDone, setB, setL, setV, setR, setN, setLD]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useStore must be used inside StoreProvider');
  return v;
}
