import { Component, Prop, h, State } from '@stencil/core';
import { messageQueueService } from '../../store/message-queue';

@Component({
  tag: 'rasa-accordion',
  styleUrl: 'accordion.scss',
  shadow: true,
})
export class RasaAccordion {
  @State() open: boolean = false;

  /**
   * Represents the label property of an Accordion component.
   * The label serves as the title or heading for accordion.
   */
  @Prop() label: string;

  componentDidLoad() {
    messageQueueService.completeRendering();
  }

  private toggle = () => {
    this.open = !this.open;
  }

  render() {
    return (
      <div class={{ 'accordion': true, 'accordion--open': this.open }} onClick={this.toggle}>
        <div class="accordion__header">
          <div class="accordion__header__title">{this.label}</div>
          <rasa-icon-chevron-down class="accordion__header__icon" />
        </div>
        <div class="accordion__description-wrapper">
          <div class="accordion__description">
            <slot></slot>
          </div>
        </div>
      </div>
    );
  }
}
