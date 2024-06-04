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

  private addClassList({bold, italic}): {[key: string]: boolean} {
    return {
      'text': true,
      'text--bold': bold,
      'text--italic': italic
    }
  }

  render() {
    const textSegments = parseFormattedString(this.value);
    return (
      <Host>
        {textSegments.map(({text, linkSrc, bold, italic }) => {
          const classList = this.addClassList({bold, italic});
          if(linkSrc) {
            return <a href={linkSrc}><span class={classList}>{text}</span></a>
          }
          return <span class={classList}>{text}</span>
        })}
      </Host>
    );
  }
}
