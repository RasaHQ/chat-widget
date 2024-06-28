import { createStore } from '@stencil/store';

type WidgetState = {
  connected: boolean;
  historyLoaded: boolean;
};

const { state } = createStore<WidgetState>({
  connected: false,
  historyLoaded: false,
});

export const getWidgetStateStore = () => state;
