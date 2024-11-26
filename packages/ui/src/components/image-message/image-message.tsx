import { Component, Host, Prop, h } from '@stencil/core';
import { messageQueueService } from '../../store/message-queue';

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
  /**
   * Image width
   */
  @Prop() width: number | string;
  /**
   * Image height
   */
  @Prop() height: number | string;

  /**
   * Is another component using it as child component
   */
  @Prop() isChild = false;

  componentDidLoad() {
    if (this.isChild) return;
    messageQueueService.completeRendering();
  }

  render() {
    const classListImage = {
      'image-message__image': true,
      'image-message__image--no-text': !this.text,
    };
    return (
      <Host>
        <rasa-image src={this.imageSrc} alt={this.imageAlt} height={this.height} width={this.width} class={classListImage}></rasa-image>
        {!!this.text && <rasa-text value={this.text} class="image-message__text"></rasa-text>}
      </Host>
    );
  }
}
