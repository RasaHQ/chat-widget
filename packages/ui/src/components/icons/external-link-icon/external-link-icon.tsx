import { Component, Prop, Host, h } from '@stencil/core';

import { calculateSize } from '../../../utils/calculate-size';

/** @internal **/
@Component({
  tag: 'rasa-icon-external-link',
})
export class ExternalLinkIcon {
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
   const viewBox = "0.0 0 1792.0 2048".split(" ");
   const [_minW, _minH, width, height] = viewBox;
   return calculateSize(+width, +height, this.size);
  }

  render() {
    const ariaHidden = this.decorative ? { 'aria-hidden': 'true' } : {};
    const { width, height } = this.getDimensions();

    return (
      <Host class="rasa-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0.0 0 1792.0 2048" {...ariaHidden}>
          {this.accessibilityTitle && <title>{this.accessibilityTitle}</title>}
          <g fill={((this.fill === 'currentColor') ? this.color : this.fill)}>
            <g><path d="M1408,1056v320c0,79.333-28.167,147.167-84.5,203.5S1199.333,1664,1120,1664H288c-79.333,0-147.167-28.167-203.5-84.5  S0,1455.333,0,1376V544c0-79.333,28.167-147.167,84.5-203.5S208.667,256,288,256h704c9.333,0,17,3,23,9s9,13.667,9,23v64  c0,9.333-3,17-9,23s-13.667,9-23,9H288c-44,0-81.667,15.667-113,47s-47,69-47,113v832c0,44,15.667,81.667,47,113s69,47,113,47h832  c44,0,81.667-15.667,113-47s47-69,47-113v-320c0-9.333,3-17,9-23s13.667-9,23-9h64c9.333,0,17,3,23,9S1408,1046.667,1408,1056z   M1792,192v512c0,17.333-6.333,32.333-19,45s-27.667,19-45,19s-32.333-6.333-45-19l-176-176l-652,652c-6.667,6.667-14.333,10-23,10  s-16.333-3.333-23-10l-114-114c-6.667-6.667-10-14.333-10-23s3.333-16.333,10-23l652-652l-176-176c-12.667-12.667-19-27.667-19-45  s6.333-32.333,19-45s27.667-19,45-19h512c17.333,0,32.333,6.333,45,19S1792,174.667,1792,192z"></path></g>
          </g>
        </svg>
      </Host>
    );
  }
}
