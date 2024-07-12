import { RasaChatbotWidget } from "@vortexwest/chat-widget-react";

function App() {
  return (
    <div>
      <RasaChatbotWidget
        serverUrl="http://pro.vortexwe.com"
        onChatWidgetOpened={console.log}
      />
    </div>
  );
}

export default App;
