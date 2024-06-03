import { defineCustomElements } from "@rasa-widget/web-component/loader";
import docJson from "@rasa-widget/web-component/doc/docs.json";
import "@rasa-widget/web-component/dist/web-component/web-component.css";


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
