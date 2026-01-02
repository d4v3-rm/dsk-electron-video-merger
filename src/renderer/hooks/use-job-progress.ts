import { useEffect } from 'react';
import { api } from '@renderer/services/ipc';
import { useAppStore } from '@renderer/store/use-app-store';

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
