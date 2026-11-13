import { Component, Prop, Host, h } from '@stencil/core';

import { calculateSize } from '../../../utils/calculate-size';

/** @internal **/
@Component({
  tag: 'rasa-icon-chat',
})
export class ChatIcon {
  /** (optional) The width and height in pixels */
  @Prop({ reflect: true }) size?: number = 24;

  /** (optional) Sets the icon color via the `fill` attribute */
  @Prop() fill?: string = 'currentColor';

  /** (optional) Alias for `fill` */
  @Prop() color?: string = 'currentColor';

  /** (optional) If `true` the SVG element will get `aria-hidden="true"` */
  @Prop() decorative?: boolean = false;

  /** (optional) When using the icon standalone, make it meaningful for accessibility */
  @Prop() accessibilityTitle?: string;

  private getDimensions() {
   const viewBox = "0 0 24 24".split(" ");
   const [_minW, _minH, width, height] = viewBox;
   return calculateSize(+width, +height, this.size);
  }

  render() {
    const ariaHidden = this.decorative ? { 'aria-hidden': 'true' } : {};
    const { width, height } = this.getDimensions();

    return (
      <Host class="rasa-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" {...ariaHidden}>
          {this.accessibilityTitle && <title>{this.accessibilityTitle}</title>}
          <g fill={((this.fill === 'currentColor') ? this.color : this.fill)}>
            <g><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path></g></g>
          </g>
        </svg>
      </Host>
    );
  }
}
