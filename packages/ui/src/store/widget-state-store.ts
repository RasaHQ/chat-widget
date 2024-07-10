import { createStore } from '@stencil/store';

type WidgetState = {
  connected: boolean;
  historyLoaded: boolean;
  activeQuickReply: string;
};

const { state, onChange } = createStore<WidgetState>({
  connected: false,
  historyLoaded: false,
  activeQuickReply: crypto.randomUUID()
});

export const widgetState = {
  isConnected: () => state.connected,
  isHistoryLoaded: () => state.historyLoaded,
  activeQuickReply: () => state.activeQuickReply,
  getState: () => ({ state, onChange })
};
