const tableGlobal = { category: "Style Tokens Global" };
const tableGranular = { category: "Style Tokens Granular " };

export const styleTokens = {
  "--color-primary": {
    control: "color",
    description: "Sets the primary color for the widget",
    table: tableGlobal,
  },
  "--color-secondary": {
    control: "color",
    description: "Sets the secondary color for the widget.",
    table: tableGlobal,
  },
  "--color-secondary-opposite": {
    control: "color",
    description: "Sets the secondary opposite color for the widget.",
    table: tableGlobal,
  },
  "--color-danger": {
    control: "color",
    description: "Sets the danger color for the widget.",
    table: tableGlobal,
  },
  "--font-family": {
    control: "text",
    description: "Sets the font family for the widget.",
    table: tableGlobal,
  },

  "--launcher-background-color": {
    control: "color",
    description: "Sets the background color of the widget launcher button.",
    table: tableGranular,
  },
  "--launcher-color": {
    control: "color",
    description: "Sets the color of the icon or text within the launcher button.",
    table: tableGranular,
  },

  "--header-background-color": {
    control: "color",
    description: "Sets the background color of the chat widget header.",
    table: tableGranular,
  },
  "--header-color": {
    control: "color",
    description: "Sets the color of the text within the header.",
    table: tableGranular,
  },

  "--input-placeholder-color": {
    control: "color",
    description: "Sets the color of the placeholder text in the input field.",
    table: tableGranular,
  },
  "--input-placeholder-opacity": {
    control: { type: "range", min: 0, max: 1, step: 0.1 },
    description: "Sets the opacity of the placeholder text in the input field.",
    table: tableGranular,
  },
  "--input-background-color": {
    control: "color",
    description: "Sets the background color of the input field.",
    table: tableGranular,
  },
  "--input-color": {
    control: "color",
    description: "Sets the color of the text entered in the input field.",
    table: tableGranular,
  },
  "--input-send-color": {
    control: "color",
    description: "Sets the color of the send button within the input field.",
    table: tableGranular,
  },

  "--messenger-background-color": {
    control: "color",
    description: "Sets the background color of the messenger area.",
    table: tableGranular,
  },

  "--message-user-color": {
    control: "color",
    description: "Sets the color of the text in the user's messages.",
    table: tableGranular,
  },
  "--message-robot-icon-background-color": {
    control: "color",
    description: "Sets the background color of the robot icon in messages.",
    table: tableGranular,
  },
  "--message-robot-icon-color": {
    control: "color",
    description: "Sets the color of the robot icon in messages.",
    table: tableGranular,
  },
  "--message-robot-background-color": {
    control: "color",
    description: "Sets the background color of the robot's messages.",
    table: tableGranular,
  },
  "--message-robot-color": {
    control: "color",
    description: "Sets the color of the text in the robot's messages.",
    table: tableGranular,
  },
  "--message-user-background-color": {
    control: "color",
    description: "Sets the background color of the user's messages.",
    table: tableGranular,
  },
  "--message-button-color": {
    control: "color",
    description: "Sets the color of the text in the user's messages.",
    table: tableGranular,
  },
  "--message-button-background-color": {
    control: "color",
    description: "Sets the background color of message buttons.",
    table: tableGranular,
  },
  "--message-button-border-color": {
    control: "color",
    description: "Sets the border color of message buttons.",
    table: tableGranular,
  },
  "--message-selected-button-color": {
    control: "color",
    description: "Sets the color of the text in selected message buttons.",
    table: tableGranular,
  },
  "--message-selected-button-background-color": {
    control: "color",
    description: "Sets the background color of selected message buttons.",
    table: tableGranular,
  },
  "--message-selected-button-border-color": {
    control: "color",
    description: "Sets the border color of selected message buttons.",
    table: tableGranular,
  },

  "--accordion-background-color": {
    control: "color",
    description: "Sets the background color of the accordion component.",
    table: tableGranular,
  },

  "--session-divider-color": {
    control: "color",
    description: "Sets the color of the divider between chat sessions.",
    table: tableGranular,
  },
  "--session-divider-text-color": {
    control: "color",
    description: "Sets the color of the text on the session divider.",
    table: tableGranular,
  },

  "--error-toast-background-color": {
    control: "color",
    description: "Sets the background color of error toast notifications.",
    table: tableGranular,
  },
  "--error-toast-color": {
    control: "color",
    description: "Sets the color of the text within error toast notifications.",
    table: tableGranular,
  },

  "--timestamp-color": {
    control: "color",
    description: "Sets the color of the text on message timestamp.",
    table: tableGranular,
  }
};
