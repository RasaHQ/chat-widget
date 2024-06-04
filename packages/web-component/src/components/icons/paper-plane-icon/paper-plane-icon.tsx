import { Component, Prop, Host, h } from '@stencil/core';

import { calculateSize } from '../../../utils/calculate-size';

/** @internal **/
@Component({
  tag: 'rasa-icon-paper-plane',
})
export class PaperPlaneIcon {
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
   const viewBox = "0 0 16 16".split(" ");
   const [_minW, _minH, width, height] = viewBox;
   return calculateSize(+width, +height, this.size);
  }

  render() {
    const ariaHidden = this.decorative ? { 'aria-hidden': 'true' } : {};
    const { width, height } = this.getDimensions();

    return (
      <Host class="rasa-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 16 16" {...ariaHidden}>
          {this.accessibilityTitle && <title>{this.accessibilityTitle}</title>}
          <g fill={((this.fill === 'currentColor') ? this.color : this.fill)}>
            <g><g id="paper-plane"><path id="Vector" d="M14.4996 0.135201L0.499557 8.2102C-0.219193 8.62583 -0.147318 9.6852 0.618307 10.0008L4.99956 11.8133V15.0008C4.99956 15.9446 6.18081 16.354 6.77143 15.6352L8.66831 13.329L12.6183 14.9602C13.2152 15.2071 13.8902 14.829 13.9871 14.1883L15.9871 1.15395C16.1152 0.319576 15.2183 -0.280424 14.4996 0.135201ZM5.99956 15.0008V12.2258L7.70268 12.929L5.99956 15.0008ZM12.9996 14.0352L6.55581 11.3727L12.7902 4.00395C12.9402 3.82895 12.6996 3.59145 12.5246 3.74145L4.54643 10.5415L0.999557 9.07895L14.9996 1.00083L12.9996 14.0352Z"></path></g></g>
          </g>
        </svg>
      </Host>
    );
  }
}
