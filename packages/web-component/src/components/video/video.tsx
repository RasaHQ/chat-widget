import { Component, Prop, h, Host } from '@stencil/core';

import { constructVideoUrl } from '../../utils/construct-video-url';

@Component({
  tag: 'rasa-video',
  styleUrl: 'video.scss',
  shadow: true,
  
})
export class RasaVideo {
  /**
   * Video source url
   */
  @Prop() src: string;
  /**
   * Autoplay on load
   */
  @Prop() autoplay = false;
  /**
   * Video player controls
   */
  @Prop() disableControls = false;
  /**
   * Loop video
   */
  @Prop() loop = false;
  /**
   * Mute video
   */
  @Prop() mute = false;
  /**
   * Video width
   */
  @Prop() width = 287;
  /**
   * Video height
   */
  @Prop() height = 170;

  render() {
    const videoSource = constructVideoUrl({
      videoSrc: this.src,
      autoplay: this.autoplay,
      disableControls: this.disableControls,
      loop: this.loop,
      mute: this.mute,
    });
    return (
      <Host>
        <iframe
          width={this.width}
          height={this.height}
          src={videoSource}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </Host>
    );
  }
}
