import { Component, Host, Prop, h, Event, EventEmitter } from '@stencil/core';
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

  /**
   * User clicked on file download
   */
  @Event() fileDownloadStarted: EventEmitter<undefined>;

  componentDidLoad() {
    messageQueueService.completeRendering();
  }
  
  private onDownloadClick = () => {
    this.fileDownloadStarted.emit();
    return true;
  }

  render() {
    return (
      <Host>
        <a href={this.fileUrl} download={this.fileName} class="file-download" target='_blank' onClick={this.onDownloadClick}>
          <rasa-icon-paperclip class="file-download__icon" size={24}></rasa-icon-paperclip>
          <rasa-text value={this.fileName} class="file-download__name"></rasa-text>
        </a>
        {!!this.text && <rasa-text value={this.text} class="image-message__text"></rasa-text>}
      </Host>
    );
  }
}
