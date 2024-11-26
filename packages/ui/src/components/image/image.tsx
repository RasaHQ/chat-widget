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
  @Prop() width: number | string;
  /**
   * Image height
   */
  @Prop() height: number | string;

  @State() showFallback = false;

  private handleImgError = () => {
    this.showFallback = true;
  };


  private getDimension(value?: number | string): string {
    if (!value) return '100%';
  
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      return `${numericValue}px`;
    }
  
    return value as string;
  }

  render() {
    const style = {
      width: this.getDimension(this.width),
      height: this.getDimension(this.height),
    };

    const size = typeof this.width === 'number' ? this.width : undefined;

    return (
      <Host>
        {this.showFallback ? (
          <rasa-icon-default-image-fallback style={style} size={size}></rasa-icon-default-image-fallback>
        ) : (
          <img src={this.src} alt={this.alt} onError={this.handleImgError} style={style} />
        )}
      </Host>
    );
  }
}
