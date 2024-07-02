import { CustomErrorClass, ErrorSeverity } from "@rasa-widget/core";

interface constructVideoUrlProps {
  videoSrc: string;
  autoplay?: boolean;
  disableControls?: boolean;
  loop?: boolean;
  mute?: boolean;
}

export const constructVideoUrl = ({ videoSrc, autoplay = false, disableControls = false, loop = false, mute = false }: constructVideoUrlProps): string => {
  if (!videoSrc) {
    throw new CustomErrorClass(ErrorSeverity.Error, 'Invalid video source');
  }

  try {
    const urlParams = new URLSearchParams();

    if (autoplay) {
      urlParams.set('autoplay', '1');
    }
    if (disableControls) {
      urlParams.set('controls', '0');
    }
    if (loop) {
      urlParams.set('loop', '1');
    }
    if (mute) {
      urlParams.set('mute', '1');
    }

    const queryString = urlParams.toString();

    if (!queryString) {
      return videoSrc;
    }

    if (videoSrc.includes('?')) {
      return `${videoSrc}&${queryString}`;
    } else {
      return `${videoSrc}?${queryString}`;
    }
  } catch (error) {
    throw new CustomErrorClass(ErrorSeverity.Error, "Can't construct video url");
  }
};
