import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'rasa-image-message',
  styleUrl: 'image-message.scss',
  shadow: true,
})
export class RasaImageMessage {
  /**
   * Image source
   */
  @Prop() imageSrc: string;
  /**
   * Alt text for the image
   */
  @Prop() imageAlt: string = '';
  /**
   * Message text
   */
  @Prop() text: string;

  render() {
    const classListImage = {
      'image-message__image': true,
      'image-message__image--no-text': !this.text,
    };
    return (
      <Host>
          <rasa-image src={this.imageSrc} alt={this.imageAlt} height="170" width='289' class={classListImage}></rasa-image>
          {!!this.text && <rasa-text value={this.text} class="image-message__text"></rasa-text>}
      </Host>
    );
  }
}
