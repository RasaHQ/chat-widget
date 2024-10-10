import "@rasahq/chat-widget-ui/dist/rasa-chatwidget/rasa-chatwidget.css";

import { defineCustomElements } from "@rasahq/chat-widget-ui/loader";
import docJson from "@rasahq/chat-widget-ui/doc/docs.json";
import { setStencilDocJson } from "../addons/doc-stenciljs";

defineCustomElements();
setStencilDocJson(docJson);

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
