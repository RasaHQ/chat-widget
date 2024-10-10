import RasaChatbotWidget from "@rasahq/chat-widget-react";

function App() {
  return (
    <div>
      <RasaChatbotWidget
        serverUrl="https://example.com"
        onChatWidgetOpened={console.log}
      />
    </div>
  );
}

export default App;
