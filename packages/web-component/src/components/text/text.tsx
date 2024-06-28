import { Component, Prop, State, h, Host, Element } from '@stencil/core';
import { parseFormattedString } from '../../utils/text-parser';
import { messageQueueService } from '../../store/message-queue';

@Component({
  tag: 'rasa-text',
  styleUrl: 'text.scss',
  shadow: true,
})
export class RasaText {
  /**
   * Text value
   */
  @Prop() value: string;

  /**
   * Disables text parsing (renders text as is, not markdown)
   */
  @Prop() disableParsing = false;

  /**
   * Disables text stream rendering
   */
  @Prop() enableStream = false;

  /**
   * Should component notify messageQueueService at complete rendering
   */
  @Prop() notifyCompleteRendering = false;

  @Element() el: HTMLRasaTextElement;

  @State() segments: Array<{ text: string; linkSrc?: string; bold?: boolean; italic?: boolean; newline?: boolean }> = [];
  @State() currentSegmentIndex: number = 0;

  componentWillLoad() {
    if (!this.disableParsing) {
      this.segments = parseFormattedString(this.value);
    }
  }

  async componentDidLoad() {
    if (this.notifyCompleteRendering && this.disableParsing) {
      messageQueueService.completeRendering();
    } else {
      await this.renderNextSegment();
    }
  }

  private streamText(text: string, element: HTMLElement, delay = 30): Promise<void> {
    return new Promise(resolve => {
      if (!this.enableStream) {
        element.textContent = text;
        resolve();
        return;
      }

      let currentChar = 0;
      const printNextChar = () => {
        if (currentChar < text.length) {
          element.textContent += text[currentChar];
          currentChar++;
          setTimeout(printNextChar, delay);
        } else {
          resolve();
        }
      };

      printNextChar();
    });
  }

  private addClassList({ bold, italic }): { [key: string]: boolean } {
    return {
      'text': true,
      'text--bold': bold,
      'text--italic': italic,
    };
  }

  private async renderNextSegment() {
    const { segments, currentSegmentIndex } = this;
    const segment = segments[currentSegmentIndex];

    const element = await this.waitForElementInDom(`[data-segment-index="${currentSegmentIndex}"]`);

    if (element) {
      if (segment.newline) {
        await this.streamText('', element, 0);
      } else {
        await this.streamText(segment.text, element, 30);
      }
    }

    this.currentSegmentIndex++;
    if (this.currentSegmentIndex < this.segments.length) {
      await this.renderNextSegment();
    } else if (this.notifyCompleteRendering) {
      messageQueueService.completeRendering();
    }
  }

  private waitForElementInDom(selector: string): Promise<HTMLElement> {
    return new Promise(resolve => {
      const element = this.el.shadowRoot.querySelector(selector) as HTMLElement;

      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = this.el.shadowRoot.querySelector(selector) as HTMLElement;

        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(this.el.shadowRoot, { childList: true, subtree: true });
    });
  }

  render() {
    if (this.disableParsing) {
      return (
        <Host>
          <span class="text">{this.value}</span>
        </Host>
      );
    }

    return (
      <Host>
        {this.segments.map(({ linkSrc, bold, italic, newline }, index) => {
          const classList = this.addClassList({ bold, italic });
          if (newline) {
            return <br key={index} data-segment-index={index}></br>;
          }
          if (linkSrc) {
            return (
              <a href={linkSrc} target="_blank" key={index}>
                <span class={classList} data-segment-index={index}></span>
              </a>
            );
          }
          return <span class={classList} key={index} data-segment-index={index}></span>;
        })}
      </Host>
    );
  }
}
