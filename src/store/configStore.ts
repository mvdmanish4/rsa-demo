import { create } from 'zustand';
import { StoreConfig } from '../types/store';

interface ConfigStore {
  config: Partial<StoreConfig>;
  setConfig: (config: Partial<StoreConfig>) => void;
}

const DEFAULT_CONFIG = {
  name: 'DÓRRO',
  color_hex: '#F2E3C9',
  background_image_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&h=300',
  logo_url: 'https://firebasestorage.googleapis.com/v0/b/allyai-website.firebasestorage.app/o/averlon-demo%2Fimage%20(16).png?alt=media&token=971ee307-4a58-4fa9-8f70-e38835cab081'
};

export const useConfigStore = create<ConfigStore>((set) => ({
  config: DEFAULT_CONFIG,
  setConfig: (newConfig) => set((state) => ({
    config: { ...state.config, ...newConfig }
  }))
}));