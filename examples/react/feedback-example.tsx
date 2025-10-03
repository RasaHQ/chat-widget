import React from 'react';
import { RasaChatbotWidget } from '@rasahq/chat-widget-react';

const FeedbackExample: React.FC = () => {
  const handleFeedbackSubmitted = (event: CustomEvent<{ rating: 'positive' | 'negative'; helpful: boolean }>) => {
    console.log('Feedback submitted:', event.detail);
    // No alert - the thank you message is handled internally by the component
  };

  const handleChatWidgetOpened = () => {
    console.log('Chat widget opened');
  };

  const handleChatWidgetClosed = () => {
    console.log('Chat widget closed');
  };

  const handleMessageSent = (event: CustomEvent<string>) => {
    console.log('Message sent:', event.detail);
  };

  const handleMessageReceived = (event: CustomEvent<unknown>) => {
    console.log('Message received:', event.detail);
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h1 style={{ color: '#333', textAlign: 'center', marginTop: 0 }}>
          Rasa Chat Widget - Complete Features Demo
        </h1>
        
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          borderLeft: '4px solid #2196f3'
        }}>
          <strong>All New Features:</strong> This demo showcases all the new features we've built including 
          conversation feedback, configurable text, custom fonts, and Rasa slot integration.
        </div>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057' }}>🎯 Complete Feature Set:</h3>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ <strong>Conversation Feedback:</strong> Thumbs up/down rating system</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ <strong>Configurable Messages:</strong> Custom question and thank you text</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ <strong>Pattern-Based Triggering:</strong> Shows after specific message types</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ <strong>Session Divider:</strong> Customizable "Session started" text</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ <strong>Custom Fonts:</strong> OrtoRNIDS government font support</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ <strong>Rasa Integration:</strong> Sends feedback as custom intent to set slots</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ <strong>Internationalization:</strong> Serbian Cyrillic text support</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ <strong>Responsive Design:</strong> Works on mobile and desktop</li>
          </ul>
        </div>
        
        <p><strong>Instructions:</strong> Open the chat widget, send a message, and wait for the bot's second text response to see the feedback component appear!</p>
      </div>

      {/* Complete Chat Widget with All Features */}
      <RasaChatbotWidget
        serverUrl="https://aiasistent.gov.rs"
        inputMessagePlaceholder="Која Вас услуга занима?"
        widgetTitle="еУправа асистент"
        widgetIcon=""
        initialPayload="/session_start"
        enableFeedback={true}
        feedbackTriggerPattern="text"
        feedbackQuestionText="Како оцењујете овај разговор?"
        feedbackThankYouText="Хвала на повратним информацијама!"
        sessionStartedText="Сесија започета:"
        fontFamily="'OrtoRNIDS', 'Lato', sans-serif"
        autoOpen={true}
        onChatWidgetFeedbackSubmitted={handleFeedbackSubmitted}
        onChatWidgetOpened={handleChatWidgetOpened}
        onChatWidgetClosed={handleChatWidgetClosed}
        onChatWidgetSentMessage={handleMessageSent}
        onChatWidgetReceivedMessage={handleMessageReceived}
      />
    </div>
  );
};

export default FeedbackExample;
