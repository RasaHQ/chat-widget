'use client';
import { RasaChatbotWidget as RasaChatbotWidgetElement, defineCustomElement as defineRasaChatbotWidget } from "@rasahq/chat-widget-ui/dist/components/rasa-chatbot-widget.js";
import { createComponent } from '@stencil/react-output-target/runtime';
import React from 'react';
const RasaChatbotWidget = createComponent({
    tagName: 'rasa-chatbot-widget',
    elementClass: RasaChatbotWidgetElement,
    react: React,
    events: {
        onChatSessionStarted: 'chatSessionStarted',
        onChatWidgetReceivedMessage: 'chatWidgetReceivedMessage',
        onChatWidgetSentMessage: 'chatWidgetSentMessage',
        onChatWidgetQuickReply: 'chatWidgetQuickReply',
        onChatWidgetOpened: 'chatWidgetOpened',
        onChatWidgetClosed: 'chatWidgetClosed',
        onChatWidgetHyperlinkClicked: 'chatWidgetHyperlinkClicked',
        onChatWidgetFileStartedDownload: 'chatWidgetFileStartedDownload'
    },
    defineCustomElement: defineRasaChatbotWidget
});
export default RasaChatbotWidget;
//# sourceMappingURL=RasaChatbotWidget.js.map