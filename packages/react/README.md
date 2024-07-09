# Rasa Chatbot React Library

The Rasa Chatbot React Library enables seamless integration of Rasa-powered chatbot into React applications using web components. This wrapper offers several advantages over traditional web components:

- **Proper Event Handling**: Custom events propagate correctly throughout the React render tree.
- **Type Safety**: Non-string and non-numeric properties and attributes bind accurately to the web component.
- **Ease of Use**: Utilizes React’s event handling and ensures type safety for a streamlined development experience.

Here’s an example of how to use it:

```jsx
<RasaChatbotWidget
  serverUrl="http://example.com"
  onChatWidgetOpened={console.log}
/>
```

For a complete example, refer to `examples/react`
