import { RasaConversationFeedback as RasaConversationFeedbackElement } from "@rasahq/chat-widget-ui/dist/components/rasa-conversation-feedback.js";
import type { EventName, StencilReactComponent } from '@stencil/react-output-target/runtime';
type RasaConversationFeedbackEvents = {
    onFeedbackSubmitted: EventName<CustomEvent<{
        rating: 'positive' | 'negative';
        helpful: boolean;
    }>>;
};
declare const RasaConversationFeedback: StencilReactComponent<RasaConversationFeedbackElement, RasaConversationFeedbackEvents>;
export default RasaConversationFeedback;
