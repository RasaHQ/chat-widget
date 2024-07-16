import {
  extractArgTypes,
  extractComponentDescription,
} from "../addons/doc-stenciljs";
import { styleTokens } from "../addons/doc-style-tokens";
import { renderWithAttributes } from "../utils/renderWithAttributes";

// Default export for Storybook
export default {
  title: "Rasa Chat Widget",
  component: "rasa-chatbot-widget",
  parameters: {
    docs: {
      extractArgTypes,
      extractComponentDescription,
      story: {
        height: "900px",
      },
    },
  },
  argTypes: styleTokens,
  args: {
    serverUrl: "https://pro.vortexwe.com"
  },
  render: renderWithAttributes("rasa-chatbot-widget"),
};

const Template = (args) => renderWithAttributes("rasa-chatbot-widget")(args);

// Export the story
export const Playground = Template.bind({});
Playground.args = {};
