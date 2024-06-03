export default {
  title: "Custom Theme",
  component: "rasa-chatbot-widget",
  parameters: {
    docs: {
      story: {
        height: "900px",
      },
    },
  },
  render: () => `
    <rasa-chatbot-widget>
      <style> 
        :root {
          --color-primary: #FF0080;
          --color-secondary: #FFFF80;
        }
      </style>
    </rasa-chatbot-widget>`,
};

export const Playground = {};
