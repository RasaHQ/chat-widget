import { link } from 'fs';

const userInputs = {
  textMessage: 'Hello',
  imageMessage: 'Image',
  highResolutionImageMessage: 'HR_image',
  accordionMessage: 'Accordion',
  carouselMessage: 'Carousel',
  highResolutionImageCarouselMessage: 'Carousel_with_high_resolution',
  fileDownloadMessage: 'File',
  quickRepliesMessage: 'Markdown',
  videoMessage: 'Video',
  quickRepliesUserReply: 'hyperlink',
  errorConnectionSocketioTest: 'Connection',
} as const;

type TUserInputsType = typeof userInputs;
type TUserInputsKeys = keyof typeof userInputs;

export type TUserInput = TUserInputsType[TUserInputsKeys];

const botResponses = {
  Hello: {
    text: "I understand you want to be connected to a human agent, but that's something I cannot help you with at the moment. Is there something else I can help you with?",
  },
  Image: {
    text: 'No country for old men.',
    attachment: {
      type: 'image',
      payload: {
        src: 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Anton_Chigurh.jpg/220px-Anton_Chigurh.jpg',
      },
    },
  },
  HR_image: {
    text: 'You are seeing high resolution image.',
    attachment: {
      type: 'image',
      payload: {
        src: 'https://store.hrblock.com/shoppingcart/assets/Win_H2.png',
      },
    },
  },
  Accordion: {
    type: 'accordion',
    elements: [
      {
        title: 'Section 1',
        text: 'This is the content for section 1. It can be any text you want or even a link [Google Website](https://www.google.com/).',
      },
      {
        title: 'Section 2',
        text: 'This is the content for section 2. It can include links or text.',
      },
      {
        title: 'Section 3',
        text: 'This is the content for section 3. Additional information goes here.',
      },
    ],
  },
  Carousel: {
    type: 'carousel',
    elements: [
      {
        image_url:
          'https://static1.moviewebimages.com/wordpress/wp-content/uploads/2023/04/scott-balua-as-captain-archer-in-enterprise-cbs-televisio.jpg',
        text: 'Click here for more details on Jonathan Archer',
        link: 'https://memory-alpha.fandom.com/wiki/Jonathan_Archer',
      },
      {
        image_url:
          'https://ew.com/thmb/ElEWKUZfMyy6I4lcak81S61eTBo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/captain-picard-2000-8b8aefbf2e2047f0a4de3b7dc9ae9ce1.jpg',
        text: 'Click here for more details on Jean-Luc Picard',
      },
      {
        image_url:
          'https://static1.cbrimages.com/wordpress/wp-content/uploads/2022/09/Kate-Mulgrew-Captain-Janeway-Star-Trek-Voyager-1.jpg',
        text: 'Click here for more details on Kathryn Janeway',
        link: 'https://memory-alpha.fandom.com/wiki/Kathryn_Janeway',
      },
    ],
  },
  Carousel_with_high_resolution: {
    type: 'carousel',
    elements: [
      {
        image_url: 'https://store.hrblock.com/shoppingcart/assets/Win_H2.png',
        text: 'Click here for more details on Premium & Business',
      },
      {
        image_url:
          'https://static1.moviewebimages.com/wordpress/wp-content/uploads/2023/04/scott-balua-as-captain-archer-in-enterprise-cbs-televisio.jpg',
        text: 'Click here for more details on Jonathan Archer',
        link: 'https://memory-alpha.fandom.com/wiki/Jonathan_Archer',
      },
    ],
  },
  File: {
    type: 'file_download',
    text: 'Download the Open-Source Rasa Python SDK',
    file_url: 'https://codeload.github.com/RasaHQ/rasa-sdk/zip/refs/heads/main',
    file_name: 'rasa-python-sdk.zip',
  },
  Markdown: {
    text: 'Choose the markdown type you want',
    quick_replies: [
      {
        content_type: 'text',
        payload: 'hyperlink',
        title: 'Hyperlink',
      },
      {
        content_type: 'text',
        payload: 'bold',
        title: 'Bold',
      },
      {
        content_type: 'text',
        payload: 'italic',
        title: 'Italic',
      },
      {
        content_type: 'text',
        payload: 'bold_italic',
        title: 'Bold_Italic',
      },
      {
        content_type: 'text',
        payload: 'new_line',
        title: 'New_Line',
      },
    ],
  },
  Video: {
    title: 'Sample Video',
    type: 'video',
    video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ?si=T5VhguqLo5F0q7R0',
  },
  hyperlink: {
    text: 'For more information, visit [Google Website](https://www.google.com/).',
  },
};

const widgetProps = {
  autoOpen: {
    key: 'auto-open',
    value: 'true',
  },
  displayTimestamp: {
    key: 'display-timestamp',
    value: 'true',
  },
  inputMessagePlaceholder: {
    key: 'input-message-placeholder',
    value: 'Rasa HQ Chatbot Widget QA automation input message placeholder',
  },
  toggleFullScreen: {
    key: 'toggle-full-screen',
    value: 'true',
  },
  widgetIcon: {
    key: 'widget-icon',
    value:
      'https://media.licdn.com/dms/image/D4D0BAQHBFuh4xBFctw/company-logo_200_200/0/1690455513485/vortexwest_logo?e=2147483647&v=beta&t=ZvvBLCPVJ0-aysJgse0Jo-hpQpUlB2Cfa5Z7BodIk5g',
  },
  widgetTitle: {
    key: 'widget-title',
    value: 'Rasa HQ Chatbot Widget QA automation title',
  },
  botIcon: {
    key: 'bot-icon',
    value:
      'https://thumbs.dreamstime.com/z/beagle-cute-cartoon-dog-logo-pet-shop-pet-care-animal-logo-pet-shop-pet-care-your-own-dog-beagle-dog-214081813.jpg',
  },
  restEnabled: {
    key: 'rest-enabled',
    value: 'true',
  },
};

export { userInputs, botResponses, widgetProps };
