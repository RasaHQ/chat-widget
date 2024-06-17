/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Button } from "@rasa-widget/core/src/types/types";
export { Button } from "@rasa-widget/core/src/types/types";
export namespace Components {
    interface ChatMessage {
        /**
          * Show sender icon
         */
        "hideSenderIcon": boolean;
        /**
          * Who sent the message
         */
        "sender": 'user' | 'bot';
    }
    interface RasaButton {
        /**
          * Is button selected as option
         */
        "isSelected": boolean;
        /**
          * Button click event name
         */
        "purpose": string;
        /**
          * Additional value that is passed at button click
         */
        "value"?: string;
    }
    interface RasaButtonGroup {
        /**
          * Buttons list
         */
        "buttons": Button[];
        /**
          * Type of button list
         */
        "type": "quick-reply" | "buttons";
    }
    interface RasaChatInput {
        /**
          * Input value
         */
        "initialValue"?: string;
    }
    interface RasaChatbotWidget {
        /**
          * Indicates whether the chat messenger can be toggled to full screen mode.
         */
        "toggleFullScreen": boolean;
    }
    interface RasaFileDownloadMessage {
        /**
          * The file name for the downloaded file
         */
        "fileName": string;
        /**
          * URL of the file to download
         */
        "fileUrl": string;
        /**
          * Message text
         */
        "text": string;
    }
    interface RasaIconArrowsContract {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconArrowsExpand {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconChat {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconCloseChat {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconDefaultImageFallback {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconPaperPlane {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconRobot {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaImage {
        /**
          * Alt text for the image
         */
        "alt": string;
        /**
          * Image height
         */
        "height": string;
        /**
          * Image source
         */
        "src": string;
        /**
          * Image width
         */
        "width": string;
    }
    interface RasaImageMessage {
        /**
          * Alt text for the image
         */
        "imageAlt": string;
        /**
          * Image source
         */
        "imageSrc": string;
        /**
          * Message text
         */
        "text": string;
    }
    interface RasaSessionDivider {
        /**
          * Session start datetime
         */
        "sessionStartDate": Date;
    }
    interface RasaText {
        /**
          * Button click event name
         */
        "value": string;
    }
}
export interface RasaButtonCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLRasaButtonElement;
}
export interface RasaChatInputCustomEvent<T> extends CustomEvent<T> {
    detail: T;
    target: HTMLRasaChatInputElement;
}
declare global {
    interface HTMLChatMessageElement extends Components.ChatMessage, HTMLStencilElement {
    }
    var HTMLChatMessageElement: {
        prototype: HTMLChatMessageElement;
        new (): HTMLChatMessageElement;
    };
    interface HTMLRasaButtonElementEventMap {
        "buttonClickHandler": {purpose: string; value?: string};
    }
    interface HTMLRasaButtonElement extends Components.RasaButton, HTMLStencilElement {
        addEventListener<K extends keyof HTMLRasaButtonElementEventMap>(type: K, listener: (this: HTMLRasaButtonElement, ev: RasaButtonCustomEvent<HTMLRasaButtonElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLRasaButtonElementEventMap>(type: K, listener: (this: HTMLRasaButtonElement, ev: RasaButtonCustomEvent<HTMLRasaButtonElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLRasaButtonElement: {
        prototype: HTMLRasaButtonElement;
        new (): HTMLRasaButtonElement;
    };
    interface HTMLRasaButtonGroupElement extends Components.RasaButtonGroup, HTMLStencilElement {
    }
    var HTMLRasaButtonGroupElement: {
        prototype: HTMLRasaButtonGroupElement;
        new (): HTMLRasaButtonGroupElement;
    };
    interface HTMLRasaChatInputElementEventMap {
        "sendMessageHandler": string;
    }
    interface HTMLRasaChatInputElement extends Components.RasaChatInput, HTMLStencilElement {
        addEventListener<K extends keyof HTMLRasaChatInputElementEventMap>(type: K, listener: (this: HTMLRasaChatInputElement, ev: RasaChatInputCustomEvent<HTMLRasaChatInputElementEventMap[K]>) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        removeEventListener<K extends keyof HTMLRasaChatInputElementEventMap>(type: K, listener: (this: HTMLRasaChatInputElement, ev: RasaChatInputCustomEvent<HTMLRasaChatInputElementEventMap[K]>) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
        removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
    var HTMLRasaChatInputElement: {
        prototype: HTMLRasaChatInputElement;
        new (): HTMLRasaChatInputElement;
    };
    interface HTMLRasaChatbotWidgetElement extends Components.RasaChatbotWidget, HTMLStencilElement {
    }
    var HTMLRasaChatbotWidgetElement: {
        prototype: HTMLRasaChatbotWidgetElement;
        new (): HTMLRasaChatbotWidgetElement;
    };
    interface HTMLRasaFileDownloadMessageElement extends Components.RasaFileDownloadMessage, HTMLStencilElement {
    }
    var HTMLRasaFileDownloadMessageElement: {
        prototype: HTMLRasaFileDownloadMessageElement;
        new (): HTMLRasaFileDownloadMessageElement;
    };
    interface HTMLRasaIconArrowsContractElement extends Components.RasaIconArrowsContract, HTMLStencilElement {
    }
    var HTMLRasaIconArrowsContractElement: {
        prototype: HTMLRasaIconArrowsContractElement;
        new (): HTMLRasaIconArrowsContractElement;
    };
    interface HTMLRasaIconArrowsExpandElement extends Components.RasaIconArrowsExpand, HTMLStencilElement {
    }
    var HTMLRasaIconArrowsExpandElement: {
        prototype: HTMLRasaIconArrowsExpandElement;
        new (): HTMLRasaIconArrowsExpandElement;
    };
    interface HTMLRasaIconChatElement extends Components.RasaIconChat, HTMLStencilElement {
    }
    var HTMLRasaIconChatElement: {
        prototype: HTMLRasaIconChatElement;
        new (): HTMLRasaIconChatElement;
    };
    interface HTMLRasaIconCloseChatElement extends Components.RasaIconCloseChat, HTMLStencilElement {
    }
    var HTMLRasaIconCloseChatElement: {
        prototype: HTMLRasaIconCloseChatElement;
        new (): HTMLRasaIconCloseChatElement;
    };
    interface HTMLRasaIconDefaultImageFallbackElement extends Components.RasaIconDefaultImageFallback, HTMLStencilElement {
    }
    var HTMLRasaIconDefaultImageFallbackElement: {
        prototype: HTMLRasaIconDefaultImageFallbackElement;
        new (): HTMLRasaIconDefaultImageFallbackElement;
    };
    interface HTMLRasaIconPaperPlaneElement extends Components.RasaIconPaperPlane, HTMLStencilElement {
    }
    var HTMLRasaIconPaperPlaneElement: {
        prototype: HTMLRasaIconPaperPlaneElement;
        new (): HTMLRasaIconPaperPlaneElement;
    };
    interface HTMLRasaIconRobotElement extends Components.RasaIconRobot, HTMLStencilElement {
    }
    var HTMLRasaIconRobotElement: {
        prototype: HTMLRasaIconRobotElement;
        new (): HTMLRasaIconRobotElement;
    };
    interface HTMLRasaImageElement extends Components.RasaImage, HTMLStencilElement {
    }
    var HTMLRasaImageElement: {
        prototype: HTMLRasaImageElement;
        new (): HTMLRasaImageElement;
    };
    interface HTMLRasaImageMessageElement extends Components.RasaImageMessage, HTMLStencilElement {
    }
    var HTMLRasaImageMessageElement: {
        prototype: HTMLRasaImageMessageElement;
        new (): HTMLRasaImageMessageElement;
    };
    interface HTMLRasaSessionDividerElement extends Components.RasaSessionDivider, HTMLStencilElement {
    }
    var HTMLRasaSessionDividerElement: {
        prototype: HTMLRasaSessionDividerElement;
        new (): HTMLRasaSessionDividerElement;
    };
    interface HTMLRasaTextElement extends Components.RasaText, HTMLStencilElement {
    }
    var HTMLRasaTextElement: {
        prototype: HTMLRasaTextElement;
        new (): HTMLRasaTextElement;
    };
    interface HTMLElementTagNameMap {
        "chat-message": HTMLChatMessageElement;
        "rasa-button": HTMLRasaButtonElement;
        "rasa-button-group": HTMLRasaButtonGroupElement;
        "rasa-chat-input": HTMLRasaChatInputElement;
        "rasa-chatbot-widget": HTMLRasaChatbotWidgetElement;
        "rasa-file-download-message": HTMLRasaFileDownloadMessageElement;
        "rasa-icon-arrows-contract": HTMLRasaIconArrowsContractElement;
        "rasa-icon-arrows-expand": HTMLRasaIconArrowsExpandElement;
        "rasa-icon-chat": HTMLRasaIconChatElement;
        "rasa-icon-close-chat": HTMLRasaIconCloseChatElement;
        "rasa-icon-default-image-fallback": HTMLRasaIconDefaultImageFallbackElement;
        "rasa-icon-paper-plane": HTMLRasaIconPaperPlaneElement;
        "rasa-icon-robot": HTMLRasaIconRobotElement;
        "rasa-image": HTMLRasaImageElement;
        "rasa-image-message": HTMLRasaImageMessageElement;
        "rasa-session-divider": HTMLRasaSessionDividerElement;
        "rasa-text": HTMLRasaTextElement;
    }
}
declare namespace LocalJSX {
    interface ChatMessage {
        /**
          * Show sender icon
         */
        "hideSenderIcon"?: boolean;
        /**
          * Who sent the message
         */
        "sender"?: 'user' | 'bot';
    }
    interface RasaButton {
        /**
          * Is button selected as option
         */
        "isSelected"?: boolean;
        /**
          * On button click event emitter
         */
        "onButtonClickHandler"?: (event: RasaButtonCustomEvent<{purpose: string; value?: string}>) => void;
        /**
          * Button click event name
         */
        "purpose"?: string;
        /**
          * Additional value that is passed at button click
         */
        "value"?: string;
    }
    interface RasaButtonGroup {
        /**
          * Buttons list
         */
        "buttons"?: Button[];
        /**
          * Type of button list
         */
        "type"?: "quick-reply" | "buttons";
    }
    interface RasaChatInput {
        /**
          * Input value
         */
        "initialValue"?: string;
        /**
          * Send message event
         */
        "onSendMessageHandler"?: (event: RasaChatInputCustomEvent<string>) => void;
    }
    interface RasaChatbotWidget {
        /**
          * Indicates whether the chat messenger can be toggled to full screen mode.
         */
        "toggleFullScreen"?: boolean;
    }
    interface RasaFileDownloadMessage {
        /**
          * The file name for the downloaded file
         */
        "fileName"?: string;
        /**
          * URL of the file to download
         */
        "fileUrl"?: string;
        /**
          * Message text
         */
        "text"?: string;
    }
    interface RasaIconArrowsContract {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconArrowsExpand {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconChat {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconCloseChat {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconDefaultImageFallback {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconPaperPlane {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaIconRobot {
        /**
          * (optional) When using the icon standalone, make it meaningful for accessibility
         */
        "accessibilityTitle"?: string;
        /**
          * (optional) Alias for `fill`
         */
        "color"?: string;
        /**
          * (optional) If `true` the SVG element will get `aria-hidden="true"`
         */
        "decorative"?: boolean;
        /**
          * (optional) Sets the icon color via the `fill` attribute
         */
        "fill"?: string;
        /**
          * (optional) The width and height in pixels
         */
        "size"?: number;
    }
    interface RasaImage {
        /**
          * Alt text for the image
         */
        "alt"?: string;
        /**
          * Image height
         */
        "height"?: string;
        /**
          * Image source
         */
        "src"?: string;
        /**
          * Image width
         */
        "width"?: string;
    }
    interface RasaImageMessage {
        /**
          * Alt text for the image
         */
        "imageAlt"?: string;
        /**
          * Image source
         */
        "imageSrc"?: string;
        /**
          * Message text
         */
        "text"?: string;
    }
    interface RasaSessionDivider {
        /**
          * Session start datetime
         */
        "sessionStartDate"?: Date;
    }
    interface RasaText {
        /**
          * Button click event name
         */
        "value"?: string;
    }
    interface IntrinsicElements {
        "chat-message": ChatMessage;
        "rasa-button": RasaButton;
        "rasa-button-group": RasaButtonGroup;
        "rasa-chat-input": RasaChatInput;
        "rasa-chatbot-widget": RasaChatbotWidget;
        "rasa-file-download-message": RasaFileDownloadMessage;
        "rasa-icon-arrows-contract": RasaIconArrowsContract;
        "rasa-icon-arrows-expand": RasaIconArrowsExpand;
        "rasa-icon-chat": RasaIconChat;
        "rasa-icon-close-chat": RasaIconCloseChat;
        "rasa-icon-default-image-fallback": RasaIconDefaultImageFallback;
        "rasa-icon-paper-plane": RasaIconPaperPlane;
        "rasa-icon-robot": RasaIconRobot;
        "rasa-image": RasaImage;
        "rasa-image-message": RasaImageMessage;
        "rasa-session-divider": RasaSessionDivider;
        "rasa-text": RasaText;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "chat-message": LocalJSX.ChatMessage & JSXBase.HTMLAttributes<HTMLChatMessageElement>;
            "rasa-button": LocalJSX.RasaButton & JSXBase.HTMLAttributes<HTMLRasaButtonElement>;
            "rasa-button-group": LocalJSX.RasaButtonGroup & JSXBase.HTMLAttributes<HTMLRasaButtonGroupElement>;
            "rasa-chat-input": LocalJSX.RasaChatInput & JSXBase.HTMLAttributes<HTMLRasaChatInputElement>;
            "rasa-chatbot-widget": LocalJSX.RasaChatbotWidget & JSXBase.HTMLAttributes<HTMLRasaChatbotWidgetElement>;
            "rasa-file-download-message": LocalJSX.RasaFileDownloadMessage & JSXBase.HTMLAttributes<HTMLRasaFileDownloadMessageElement>;
            "rasa-icon-arrows-contract": LocalJSX.RasaIconArrowsContract & JSXBase.HTMLAttributes<HTMLRasaIconArrowsContractElement>;
            "rasa-icon-arrows-expand": LocalJSX.RasaIconArrowsExpand & JSXBase.HTMLAttributes<HTMLRasaIconArrowsExpandElement>;
            "rasa-icon-chat": LocalJSX.RasaIconChat & JSXBase.HTMLAttributes<HTMLRasaIconChatElement>;
            "rasa-icon-close-chat": LocalJSX.RasaIconCloseChat & JSXBase.HTMLAttributes<HTMLRasaIconCloseChatElement>;
            "rasa-icon-default-image-fallback": LocalJSX.RasaIconDefaultImageFallback & JSXBase.HTMLAttributes<HTMLRasaIconDefaultImageFallbackElement>;
            "rasa-icon-paper-plane": LocalJSX.RasaIconPaperPlane & JSXBase.HTMLAttributes<HTMLRasaIconPaperPlaneElement>;
            "rasa-icon-robot": LocalJSX.RasaIconRobot & JSXBase.HTMLAttributes<HTMLRasaIconRobotElement>;
            "rasa-image": LocalJSX.RasaImage & JSXBase.HTMLAttributes<HTMLRasaImageElement>;
            "rasa-image-message": LocalJSX.RasaImageMessage & JSXBase.HTMLAttributes<HTMLRasaImageMessageElement>;
            "rasa-session-divider": LocalJSX.RasaSessionDivider & JSXBase.HTMLAttributes<HTMLRasaSessionDividerElement>;
            "rasa-text": LocalJSX.RasaText & JSXBase.HTMLAttributes<HTMLRasaTextElement>;
        }
    }
}
