import { CustomErrorClass } from '@vortexwest/chat-widget-sdk';
import { createStore } from '@stencil/store';

const { state, onChange } = createStore({
  errorMessage: null as CustomErrorClass,
});

export const errorMessageService = {
  setErrorMessage: (error: CustomErrorClass) => {
    state.errorMessage = error;
  },

  getState: () => ({ state, onChange }),

  errorReceived: () => {
    state.errorMessage = null;
  },
};