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
   const viewBox = "0 0 22 20".split(" ");
   const [_minW, _minH, width, height] = viewBox;
   return calculateSize(+width, +height, this.size);
  }

  render() {
    const ariaHidden = this.decorative ? { 'aria-hidden': 'true' } : {};
    const { width, height } = this.getDimensions();

    return (
      <Host class="rasa-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 22 20" {...ariaHidden}>
          {this.accessibilityTitle && <title>{this.accessibilityTitle}</title>}
          <g fill={((this.fill === 'currentColor') ? this.color : this.fill)}>
            <g><path d="M11.0194 0C4.93292 0 0.00121062 4.00039 0.00121062 8.9375C0.00121062 10.9841 0.858223 12.8584 2.27869 14.3602C1.63819 16.0574 0.304243 17.4917 0.282721 17.5076C-0.00244814 17.8084 -0.0777757 18.2488 0.0836405 18.6248C0.250472 19.0008 0.619017 19.25 1.0331 19.25C3.68033 19.25 5.72924 18.1436 7.02057 17.2627C8.22581 17.6516 9.61184 17.875 11.0194 17.875C17.1059 17.875 22 13.8733 22 8.9375C22 4.00168 17.1059 0 11.0194 0ZM11.0237 15.8125C9.87226 15.8125 8.73718 15.6353 7.64988 15.2917L6.67062 14.9856L5.83126 15.5764C5.21787 16.0112 4.37291 16.4951 3.35621 16.8225C3.67366 16.3017 3.97475 15.716 4.21193 15.093L4.66906 13.8899L3.78148 12.9501C3.0054 12.1215 2.06918 10.7508 2.06918 8.9375C2.06918 5.14551 6.08307 2.0625 11.0224 2.0625C15.9617 2.0625 19.9756 5.14551 19.9756 8.9375C19.9756 12.7295 15.9609 15.8125 11.0237 15.8125Z"></path></g>
          </g>
        </svg>
      </Host>
    );
  }
}