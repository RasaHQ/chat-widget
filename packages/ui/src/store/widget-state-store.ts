import { createStore } from '@stencil/store';
import { v4 as uuidv4 } from 'uuid';

type WidgetState = {
  connected: boolean;
  historyLoaded: boolean;
  activeQuickReply: string;
};

const { state, onChange } = createStore<WidgetState>({
  connected: false,
  historyLoaded: false,
  activeQuickReply: uuidv4()
});

export const widgetState = {
  isConnected: () => state.connected,
  isHistoryLoaded: () => state.historyLoaded,
  activeQuickReply: () => state.activeQuickReply,
  getState: () => ({ state, onChange })
};
