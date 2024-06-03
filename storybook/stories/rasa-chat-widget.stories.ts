import { extractArgTypes, extractComponentDescription } from '../addons/doc-stenciljs';
import { renderWithAttributes } from '../utils/renderWithAttributes';

export default {
  title: 'Rasa Chatbot Widget',
  component: 'rasa-chatbot-widget',
  parameters: {
    docs: {
      extractArgTypes,
      extractComponentDescription,
      story: {
        height: '900px',
      },
    },
  },
  render: renderWithAttributes('rasa-chatbot-widget'),
};

export const Playground = {};
