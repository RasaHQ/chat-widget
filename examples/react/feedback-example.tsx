import React from 'react';
import { RasaChatbotWidget } from '@rasahq/chat-widget-react';

const FeedbackExample: React.FC = () => {
  const handleFeedbackSubmitted = (event: CustomEvent<{ rating: 'positive' | 'negative'; helpful: boolean }>) => {
    console.log('Feedback submitted:', event.detail);
    alert(`Thank you for your feedback!\nRating: ${event.detail.rating}\nHelpful: ${event.detail.helpful}`);
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
          Rasa Chat Widget - Feedback Feature Demo
        </h1>
        
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          borderLeft: '4px solid #2196f3'
        }}>
          <strong>New Feature:</strong> This demo shows the conversation feedback feature. 
          The feedback component will appear after you exchange a few messages with the bot.
        </div>
        
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          <h3 style={{ marginTop: 0, color: '#495057' }}>Feedback Features:</h3>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ Thumbs up/down rating system</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ "Was this conversation helpful?" question</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ Automatic display after 3 messages</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ Responsive design for mobile and desktop</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ Event handling for feedback data</li>
            <li style={{ margin: '5px 0', color: '#6c757d' }}>✅ Customizable styling with CSS variables</li>
          </ul>
        </div>
        
        <p><strong>Instructions:</strong> Open the chat widget and send a few messages to see the feedback component appear!</p>
      </div>

      {/* Chat Widget with Feedback Enabled */}
      <RasaChatbotWidget
        serverUrl="https://minbpd.aiasistent.gov.rs"
        enableFeedback={true}
        feedbackTriggerMessages={3}
        widgetTitle="еУправа асистент"
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
