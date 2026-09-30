import { renderWithAttributes } from "../utils/renderWithAttributes";

// One story per built-in theme. Select a theme with the `theme` prop.
export default {
  title: "Themes",
  component: "rasa-chatbot-widget",
  parameters: {
    docs: {
      story: {
        height: "900px",
      },
    },
  },
  render: renderWithAttributes("rasa-chatbot-widget"),
  args: {
    widgetTitle: "Northwind Assistant",
    welcomeMessage: "Ask anything about plans, billing or your account.",
    suggestedPrompts: "Show me plans, Reset my password, Talk to support",
    launcherLabel: "Ask us",
    autoOpen: true,
  },
};

export const Light = { args: { theme: "light" } };
export const Dark = { args: { theme: "dark" } };
export const Auto = { args: { theme: "auto" } };
export const Midnight = { args: { theme: "midnight" } };
export const Ocean = { args: { theme: "ocean" } };
export const Forest = { args: { theme: "forest" } };
export const Sunset = { args: { theme: "sunset" } };
export const Mono = { args: { theme: "mono" } };

export const BottomLeft = {
  args: { theme: "ocean", position: "bottom-left" },
};
