import "@vortexwest/chat-widget-ui/dist/rasa-chatwigdet/rasa-chatwigdet.css";

import { defineCustomElements } from "@vortexwest/chat-widget-ui/loader";
import docJson from "@vortexwest/chat-widget-ui/doc/docs.json";
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
