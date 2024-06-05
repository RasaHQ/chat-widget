import { Component, Prop, h, Host } from '@stencil/core';

import { formatDateTime } from '../../utils/format-datetime';

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

  render() {
    return (
      <Host>
        <div class="session-divider__line"></div>
          <rasa-text class="session-divider__text" value={`Session started on ${formatDateTime(this.sessionStartDate)}`}></rasa-text>
        <div class="session-divider__line"></div>
      </Host>
    );
  }
}
