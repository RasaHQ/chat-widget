import { RasaChatbotWidget } from "@vortexwest/chat-widget-react";
import logo from "../public/vortexwest-logo-color-on-light.svg";

function App() {
  return (
    <div>
      <img className="vortex-logo" src={logo} />
      <RasaChatbotWidget
        serverUrl="https://pro.vortexwe.com"
        initialPayload="/session_start"
        toggleFullScreen
        onChatWidgetOpened={console.log}
      />
    </div>
  );
}

export default App;
