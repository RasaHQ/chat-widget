'use client';
import { RasaRating as RasaRatingElement, defineCustomElement as defineRasaRating } from "@rasahq/chat-widget-ui/dist/components/rasa-rating.js";
import { createComponent } from '@stencil/react-output-target/runtime';
import React from 'react';
const RasaRating = createComponent({
    tagName: 'rasa-rating',
    elementClass: RasaRatingElement,
    react: React,
    events: { onRatingSelected: 'ratingSelected' },
    defineCustomElement: defineRasaRating
});
export default RasaRating;
//# sourceMappingURL=RasaRating.js.map