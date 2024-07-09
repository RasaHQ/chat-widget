import { CarouselElement } from '@rasa-widget/core';
import { Component, h, State, Element, Prop, EventEmitter, Event } from '@stencil/core';
import { messageQueueService } from '../../store/message-queue';

@Component({
  tag: 'rasa-carousel',
  styleUrl: 'carousel.scss',
  shadow: true,
})
export class RasaCarousel {
  /**
   * List of carousel elements
   */
  @Prop() elements: CarouselElement[];
  /**
   * User clicked on link
   */
  @Event() linkClicked: EventEmitter<undefined>;

  @State() currentIndex: number = 0;
  @Element() el: HTMLRasaCarouselElement;

  private nextSlide = () => {
    this.currentIndex = (this.currentIndex + 1) % this.elements.length;
    this.scrollToCurrentIndex();
  };

  private prevSlide = () => {
    this.currentIndex = (this.currentIndex - 1 + this.elements.length) % this.elements.length;
    this.scrollToCurrentIndex();
  };

  private hasNext() {
    return this.currentIndex + 1 != this.elements.length;
  }

  private hasPrevious() {
    return this.currentIndex > 0;
  }

  private scrollToCurrentIndex() {
    const container = this.el.shadowRoot.querySelector('.carousel__slides') as HTMLElement;
    container.style.scrollSnapType = 'none'; // Disable scroll snapping
    container.scrollTo({
      left: this.currentIndex * 188,
      behavior: 'smooth',
    });

    setTimeout(() => {
      container.style.scrollSnapType = 'x mandatory'; // Re-enable scroll snapping after scrolling element into view
    }, 500); // Timeout matching the scroll duration
  }

  private onLinkClick() {
    this.linkClicked.emit();
    return true;
  }

  private renderCarouselElement({ text, imageUrl, link }: CarouselElement, index: number) {
    if (!link) {
      return (
        <div class={{ 'carousel__slide': true, 'carousel__slide--active': index === this.currentIndex }}>
          <rasa-image-message class="carousel__image" height={112} text={text} imageSrc={imageUrl} width={188}></rasa-image-message>
        </div>
      );
    }
    return (
      <a href={link} target="_blank" onClick={this.onLinkClick}>
        <div class={{ 'carousel__slide': true, 'carousel__slide--active': index === this.currentIndex }}>
          <rasa-image-message class="carousel__image" height={112} text={text} imageSrc={imageUrl} width={188}></rasa-image-message>
        </div>
      </a>
    );
  }

  componentDidLoad() {
    messageQueueService.completeRendering();
  }

  render() {
    return (
      <div class="carousel">
        {this.hasPrevious() && (
          <div class="carousel__icon carousel__icon--left">
            <rasa-icon-chevron-down size={24} class="carousel__previous" onClick={this.prevSlide}></rasa-icon-chevron-down>
          </div>
        )}
        <div class="carousel__slides">{this.elements.map((element, index) => this.renderCarouselElement(element, index))}</div>
        {this.hasNext() && (
          <div class="carousel__icon carousel__icon--right">
            <rasa-icon-chevron-down size={24} class="carousel__next" onClick={this.nextSlide}></rasa-icon-chevron-down>
          </div>
        )}
        <div class="carousel__fade"></div>
      </div>
    );
  }
}
