import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'rasa-link-button',
  styleUrl: 'link-button.scss',
  shadow: true,
})
export class RasaLinkButton {
  /**
   * Href value for the link button
   */
  @Prop() link: string;
  /**
   * Is button selected as option
   */
  @Prop() isSelected: boolean = false;


  render() {
    return (

      <a href={this.link} target="_blank"  >
        <div class={`rasa-link-button ${this.isSelected && 'rasa-link-button--selected'}`}>
          <slot></slot>
          <rasa-icon-external-link class={`rasa-link-button-icon-right`} size={16}></rasa-icon-external-link>
        </div>
      </a>
    );
  }
}
