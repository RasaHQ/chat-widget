import { Component, Prop, Host, h } from '@stencil/core';

import { calculateSize } from '../../../utils/calculate-size';

/** @internal **/
@Component({
  tag: 'rasa-icon-default-image-fallback',
})
export class DefaultImageFallbackIcon {
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
   const viewBox = "0 0 289 170".split(" ");
   const [_minW, _minH, width, height] = viewBox;
   return calculateSize(+width, +height, this.size);
  }

  render() {
    const ariaHidden = this.decorative ? { 'aria-hidden': 'true' } : {};
    const { width, height } = this.getDimensions();

    return (
      <Host class="rasa-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 289 170" {...ariaHidden}>
          {this.accessibilityTitle && <title>{this.accessibilityTitle}</title>}
          <g fill={((this.fill === 'currentColor') ? this.color : this.fill)}>
            <g><g clip-path="url(#clip0_214_1199)"><path d="M0 4C0 1.79086 1.79086 0 4 0H269C280.046 0 289 8.95431 289 20V150C289 161.046 280.046 170 269 170H20C8.9543 170 0 161.046 0 150V4Z" fill="#F6F7FB"></path><rect width="289" height="170" fill="#DDDCF6"></rect><path d="M217.276 137.812C216.213 139.786 214.164 141 211.924 141H79.0728C76.7873 141 74.6962 139.718 73.6599 137.68C72.6237 135.643 72.8192 133.198 74.1663 131.35L100.737 94.9217C101.882 93.3393 103.704 92.4286 105.64 92.4286C107.576 92.4286 109.404 93.3548 110.548 94.9232L122.869 111.813L158.285 59.0296C159.427 57.0246 161.325 56 163.337 56C165.349 56 167.266 57.0139 168.389 58.7037L216.976 131.561C218.225 133.411 218.339 135.801 217.276 137.812Z" fill="#B7B2F7"></path><circle cx="84" cy="48" r="19" fill="#CAC7F7"></circle></g><defs></defs></g>
          </g>
        </svg>
      </Host>
    );
  }
}
