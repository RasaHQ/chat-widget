import { Component, Prop, Host, h } from '@stencil/core';

import { calculateSize } from '../../../utils/calculate-size';

/** @internal **/
@Component({
  tag: 'rasa-icon-robot',
})
export class RobotIcon {
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
            <g><path d="M4.8 10.6H5.6V15.4H4.8C4.69491 15.4001 4.59082 15.3795 4.4937 15.3394C4.39659 15.2992 4.30835 15.2403 4.23403 15.166C4.15972 15.0917 4.1008 15.0034 4.06064 14.9063C4.02048 14.8092 3.99987 14.7051 4 14.6V11.4C3.99987 11.2949 4.02048 11.1908 4.06064 11.0937C4.1008 10.9966 4.15972 10.9083 4.23403 10.834C4.30835 10.7597 4.39659 10.7008 4.4937 10.6606C4.59082 10.6205 4.69491 10.5999 4.8 10.6ZM17.6 9.4V16.2C17.5996 16.6242 17.4309 17.0309 17.1309 17.3309C16.8309 17.6309 16.4242 17.7996 16 17.8H8C7.57578 17.7996 7.16906 17.6309 6.86909 17.3309C6.56912 17.0309 6.40042 16.6242 6.4 16.2V9.4C6.39991 9.13733 6.45159 8.87722 6.55207 8.63453C6.65255 8.39184 6.79986 8.17133 6.9856 7.9856C7.17133 7.79986 7.39184 7.65255 7.63453 7.55207C7.87722 7.45159 8.13733 7.39991 8.4 7.4H11.2V5.8C11.2 5.58783 11.2843 5.38434 11.4343 5.23431C11.5843 5.08429 11.7878 5 12 5C12.2122 5 12.4157 5.08429 12.5657 5.23431C12.7157 5.38434 12.8 5.58783 12.8 5.8V7.4H15.6C15.8627 7.39991 16.1228 7.45159 16.3655 7.55207C16.6082 7.65255 16.8287 7.79986 17.0144 7.9856C17.2001 8.17133 17.3475 8.39184 17.4479 8.63453C17.5484 8.87722 17.6001 9.13733 17.6 9.4ZM10.6 11.4C10.6 11.2022 10.5414 11.0089 10.4315 10.8444C10.3216 10.68 10.1654 10.5518 9.98268 10.4761C9.79996 10.4004 9.59889 10.3806 9.40491 10.4192C9.21093 10.4578 9.03275 10.553 8.89289 10.6929C8.75304 10.8327 8.6578 11.0109 8.61922 11.2049C8.58063 11.3989 8.60043 11.6 8.67612 11.7827C8.75181 11.9654 8.87998 12.1216 9.04443 12.2315C9.20888 12.3414 9.40222 12.4 9.6 12.4C9.73133 12.4 9.86137 12.3742 9.9827 12.3239C10.104 12.2736 10.2143 12.2 10.3071 12.1071C10.4 12.0143 10.4736 11.904 10.5239 11.7827C10.5742 11.6614 10.6 11.5313 10.6 11.4ZM10.4 14.6H8.8V15.4H10.4V14.6ZM12.8 14.6H11.2V15.4H12.8V14.6ZM15.4 11.4C15.4 11.2022 15.3414 11.0089 15.2315 10.8444C15.1216 10.68 14.9654 10.5518 14.7827 10.4761C14.6 10.4004 14.3989 10.3806 14.2049 10.4192C14.0109 10.4578 13.8327 10.553 13.6929 10.6929C13.553 10.8327 13.4578 11.0109 13.4192 11.2049C13.3806 11.3989 13.4004 11.6 13.4761 11.7827C13.5518 11.9654 13.68 12.1216 13.8444 12.2315C14.0089 12.3414 14.2022 12.4 14.4 12.4C14.5313 12.4 14.6614 12.3742 14.7827 12.3239C14.904 12.2736 15.0143 12.2 15.1071 12.1071C15.2 12.0143 15.2736 11.904 15.3239 11.7827C15.3742 11.6614 15.4 11.5313 15.4 11.4ZM15.2 14.6H13.6V15.4H15.2V14.6ZM20 11.4V14.6C20.0001 14.7051 19.9795 14.8092 19.9394 14.9063C19.8992 15.0034 19.8403 15.0917 19.766 15.166C19.6917 15.2403 19.6034 15.2992 19.5063 15.3394C19.4092 15.3795 19.3051 15.4001 19.2 15.4H18.4V10.6H19.2C19.3051 10.5999 19.4092 10.6205 19.5063 10.6606C19.6034 10.7008 19.6917 10.7597 19.766 10.834C19.8403 10.9083 19.8992 10.9966 19.9394 11.0937C19.9795 11.1908 20.0001 11.2949 20 11.4Z"></path></g>
          </g>
        </svg>
      </Host>
    );
  }
}
