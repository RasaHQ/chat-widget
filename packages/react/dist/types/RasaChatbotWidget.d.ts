import type { EventName, StencilReactComponent } from '@stencil/react-output-target/runtime';
import { RasaChatbotWidget as RasaChatbotWidgetElement } from "@rasahq/chat-widget-ui/dist/components/rasa-chatbot-widget.js";
type RasaChatbotWidgetEvents = {
    onChatSessionStarted: EventName<CustomEvent<{
        sessionId: string;
    }>>;
    onChatWidgetReceivedMessage: EventName<CustomEvent<unknown>>;
    onChatWidgetSentMessage: EventName<CustomEvent<string>>;
    onChatWidgetQuickReply: EventName<CustomEvent<string>>;
    onChatWidgetOpened: EventName<CustomEvent<undefined>>;
    onChatWidgetClosed: EventName<CustomEvent<undefined>>;
    onChatWidgetHyperlinkClicked: EventName<CustomEvent<undefined>>;
    onChatWidgetFileStartedDownload: EventName<CustomEvent<undefined>>;
};
declare const RasaChatbotWidget: StencilReactComponent<RasaChatbotWidgetElement, RasaChatbotWidgetEvents>;
export default RasaChatbotWidget;
