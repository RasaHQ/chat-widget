import { Component, Prop, h, Host } from '@stencil/core';

import { formatDateTime } from '../../utils/format-datetime';
import { messageQueueService } from '../../store/message-queue';

@Component({
  tag: 'rasa-session-divider',
  styleUrl: 'session-divider.scss',
  shadow: true,
})
export class SessionDivider {
  /**
   * Session start datetime
   */
  @Prop() sessionStartDate: Date;

  /**
   * Text to display before the session start date
   */
  @Prop() sessionStartedText: string = 'Session started on';

  componentDidLoad() {
    messageQueueService.completeRendering();
  }

  render() {
    return (
      <Host>
        <div class="session-divider__line"></div>
          <rasa-text class="session-divider__text" disableParsing={true} value={`${this.sessionStartedText} ${formatDateTime(this.sessionStartDate)}`}></rasa-text>
        <div class="session-divider__line"></div>
      </Host>
    );
  }
}
