import { Component, Prop, Host, h } from '@stencil/core';

import { calculateSize } from '../../../utils/calculate-size';

/** @internal **/
@Component({
  tag: 'rasa-icon-paperclip',
})
export class PaperclipIcon {
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
            <g><g id="paperclip"><path id="Vector" d="M8.65937 19.2002C7.62575 19.2002 6.59209 18.8264 5.80522 18.0788C4.23134 16.5837 4.23134 14.151 5.80515 12.656L13.9949 4.87588C15.224 3.70824 17.2239 3.70824 18.453 4.87588C19.6821 6.04355 19.6821 7.9434 18.453 9.11101L11.4958 15.7202C10.6115 16.5604 9.17247 16.5605 8.288 15.7202C7.40362 14.88 7.40362 13.513 8.288 12.6728L13.6099 7.61711C13.7563 7.47799 13.9938 7.47799 14.1402 7.61711L14.3171 7.78517C14.4636 7.92428 14.4636 8.14985 14.3171 8.28899L8.99525 13.3447C8.50084 13.8144 8.50084 14.5786 8.99528 15.0483C9.48968 15.518 10.2942 15.518 10.7886 15.0483L17.7457 8.43909C18.5848 7.64195 18.5848 6.34491 17.7457 5.54771C16.9065 4.75057 15.5412 4.75063 14.7022 5.54771L6.51243 13.3279C5.32862 14.4525 5.32862 16.2823 6.51243 17.4069C7.69631 18.5315 9.62253 18.5316 10.8063 17.407L17.6108 10.9428C17.7572 10.8037 17.9947 10.8037 18.1411 10.9428L18.318 11.1109C18.4644 11.25 18.4644 11.4756 18.318 11.6147L11.5136 18.0788C10.7267 18.8264 9.69303 19.2002 8.65937 19.2002Z" fill="white"></path></g></g>
          </g>
        </svg>
      </Host>
    );
  }
}
