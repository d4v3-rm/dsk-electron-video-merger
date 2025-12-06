import { useEffect } from 'react';
import { api } from '../services/ipc';
import { useAppStore } from '../store/use-app-store';

export const useJobProgress = () => {
  useEffect(() => {
    const unsubscribe = api.subscribeJobProgress((payload) => {
      useAppStore.getState().upsertJobProgress(payload);
    });

    return () => {
      unsubscribe();
    };
  }, []);
};
