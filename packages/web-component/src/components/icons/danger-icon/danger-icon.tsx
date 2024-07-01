import { Component, Prop, Host, h } from '@stencil/core';

import { calculateSize } from '../../../utils/calculate-size';

/** @internal **/
@Component({
  tag: 'rasa-icon-danger',
})
export class DangerIcon {
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
            <g><path id="Vector" d="M8 1.25C11.7069 1.25 14.75 4.25234 14.75 8C14.75 11.7278 11.7309 14.75 8 14.75C4.27362 14.75 1.25 11.7324 1.25 8C1.25 4.27491 4.26881 1.25 8 1.25ZM8 0.25C3.72009 0.25 0.25 3.72134 0.25 8C0.25 12.2812 3.72009 15.75 8 15.75C12.2799 15.75 15.75 12.2812 15.75 8C15.75 3.72134 12.2799 0.25 8 0.25ZM7.64094 4H8.35903C8.57225 4 8.74259 4.17756 8.73372 4.39062L8.51497 9.64062C8.50659 9.8415 8.34134 10 8.14028 10H7.85969C7.65866 10 7.49338 9.84147 7.485 9.64062L7.26625 4.39062C7.25741 4.17756 7.42772 4 7.64094 4ZM8 10.625C7.51675 10.625 7.125 11.0168 7.125 11.5C7.125 11.9832 7.51675 12.375 8 12.375C8.48325 12.375 8.875 11.9832 8.875 11.5C8.875 11.0168 8.48325 10.625 8 10.625Z"></path></g>
          </g>
        </svg>
      </Host>
    );
  }
}
