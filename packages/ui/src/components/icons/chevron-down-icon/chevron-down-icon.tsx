import { Component, Prop, Host, h } from '@stencil/core';

import { calculateSize } from '../../../utils/calculate-size';

/** @internal **/
@Component({
  tag: 'rasa-icon-chevron-down',
})
export class ChevronDownIcon {
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
            <g><path d="M16.8286 9.95673L12.405 14.1951C12.2569 14.3201 12.118 14.371 11.9999 14.371C11.8819 14.371 11.7228 14.3197 11.6159 14.2162L7.17151 9.95673C6.94938 9.74608 6.94216 9.3734 7.15484 9.17202C7.36607 8.94922 7.71919 8.94197 7.93979 9.15538L11.9999 13.047L16.0601 9.15813C16.28 8.94473 16.6337 8.95197 16.845 9.17477C17.0577 9.3734 17.0508 9.74608 16.8286 9.95673Z"></path></g>
          </g>
        </svg>
      </Host>
    );
  }
}
