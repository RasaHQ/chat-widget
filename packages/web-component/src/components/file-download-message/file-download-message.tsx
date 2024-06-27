import { Component, Host, Prop, h } from '@stencil/core';
import { messageQueueService } from '../../store/message-queue';

@Component({
  tag: 'rasa-file-download-message',
  styleUrl: 'file-download-message.scss',
  shadow: true,
})
export class RasaFileDownloadMessage {
  /**
   * URL of the file to download
   */
  @Prop() fileUrl: string;
  /**
   * The file name for the downloaded file
   */
  @Prop() fileName: string;
  /**
   * Message text
   */
  @Prop() text: string;

  componentDidLoad() {
    messageQueueService.completeRendering();
  }

  render() {
    return (
      <Host>
        <a href={this.fileUrl} download={this.fileName} class="file-download">
          <rasa-icon-paperclip class="file-download__icon" size={24}></rasa-icon-paperclip>
          <rasa-text value={this.fileName} class="file-download__name"></rasa-text>
        </a>
        {!!this.text && <rasa-text value={this.text} class="image-message__text"></rasa-text>}
      </Host>
    );
  }
}
