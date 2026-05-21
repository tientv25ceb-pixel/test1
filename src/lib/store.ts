import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Item, mockItems } from './data';

interface ShareStore {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'createdAt' | 'requestedCount'>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useStore = create<ShareStore>()(
  persist(
    (set) => ({
      items: mockItems,
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      addItem: (newItem) => set((state) => ({
        items: [
          {
            ...newItem,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split('T')[0],
            requestedCount: 0,
          },
          ...state.items,
        ]
      })),
    }),
    {
      name: 'dn-unishare-storage-v4',
    }
  )
);
