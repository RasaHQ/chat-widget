import { Component, Prop, State, h, Host } from '@stencil/core';

@Component({
  tag: 'rasa-image',
  styleUrl: 'image.scss',
  shadow: true,
})
export class RasaImage {
  /**
   * Image source
   */
  @Prop() src: string;
  /**
   * Alt text for the image
   */
  @Prop() alt: string = '';
  /**
   * Image width
   */
  @Prop() width: number;
  /**
   * Image height
   */
  @Prop() height: number;

  @State() showFallback = false;

  private handleImgError = () => {
    this.showFallback = true;
  };

  render() {
    const style = {
      width: this.width ? `${this.width}px` : 'auto',
      height: this.height ? `${this.height}px` : 'auto',
    };
    return (
      <Host>
        {this.showFallback ? (
          <rasa-icon-default-image-fallback style={style} size={this.width}></rasa-icon-default-image-fallback>
        ) : (
          <img src={this.src} alt={this.alt} onError={this.handleImgError} style={style} />
        )}
      </Host>
    );
  }
}
