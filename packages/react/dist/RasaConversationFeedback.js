'use client';
import { RasaConversationFeedback as RasaConversationFeedbackElement, defineCustomElement as defineRasaConversationFeedback } from "@rasahq/chat-widget-ui/dist/components/rasa-conversation-feedback.js";
import { createComponent } from '@stencil/react-output-target/runtime';
import React from 'react';
const RasaConversationFeedback = createComponent({
    tagName: 'rasa-conversation-feedback',
    elementClass: RasaConversationFeedbackElement,
    react: React,
    events: { onFeedbackSubmitted: 'feedbackSubmitted' },
    defineCustomElement: defineRasaConversationFeedback
});
export default RasaConversationFeedback;
//# sourceMappingURL=RasaConversationFeedback.js.map