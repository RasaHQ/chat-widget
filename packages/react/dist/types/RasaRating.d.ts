import { RasaRating as RasaRatingElement } from "@rasahq/chat-widget-ui/dist/components/rasa-rating.js";
import type { EventName, StencilReactComponent } from '@stencil/react-output-target/runtime';
type RasaRatingEvents = {
    onRatingSelected: EventName<CustomEvent<{
        value: string;
    }>>;
};
declare const RasaRating: StencilReactComponent<RasaRatingElement, RasaRatingEvents>;
export default RasaRating;
