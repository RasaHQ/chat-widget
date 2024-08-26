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
    <rasa-chatbot-widget server-url="https://pro.vortexwe.com">
      <style> 
        :root {
          --color-primary: #FF0080;
          --color-secondary: #FFFF80;
          --font-family: 'Brush Script MT', cursive;
        }
      </style>
    </rasa-chatbot-widget>`,
};

export const Playground = {};
