import { Component, Prop, h, Host } from '@stencil/core';

import { parseFormattedString } from '../../utils/text-parser';

@Component({
  tag: 'rasa-text',
  styleUrl: 'text.scss',
  shadow: true,
})
export class RasaText {
  /**
   * Button click event name
   */
  @Prop() value: string;
  /**
   * Disables text parsing (renders text as is, not markdown)
   */
  @Prop() disableParsing = false;

  private addClassList({ bold, italic }): { [key: string]: boolean } {
    return {
      'text': true,
      'text--bold': bold,
      'text--italic': italic,
    };
  }

  render() {
    if (this.disableParsing)
      return (
        <Host>
          <span class={'text'}>{this.value}</span>
        </Host>
      );
    const textSegments = parseFormattedString(this.value);
    return (
      <Host>
        {textSegments.map(({ text, linkSrc, bold, italic, newline }) => {
          const classList = this.addClassList({ bold, italic });
          if (newline) {
            return <br></br>;
          }
          if (linkSrc) {
            return (
              <a href={linkSrc} target="_blank">
                <span class={classList}>{text}</span>
              </a>
            );
          }
          return <span class={classList}>{text}</span>;
        })}
      </Host>
    );
  }
}
