import { constructVideoUrl } from './construct-video-url';

describe('constructVideoUrl', () => {
  it('constructs URL with no parameters', () => {
    const videoSrc = 'http://youtube.com/video';

    const result = constructVideoUrl({ videoSrc });

    expect(result).toBe(videoSrc);
  });

  it('constructs URL with autoplay parameter', () => {
    const videoSrc = 'http://youtube.com/video';

    const result = constructVideoUrl({ videoSrc, autoplay: true });

    expect(result).toBe(`${videoSrc}?autoplay=1`);
  });

  it('constructs URL with multiple parameters (autoplay and disableControls)', () => {
    const videoSrc = 'http://youtube.com/video';

    const result = constructVideoUrl({ videoSrc, autoplay: true, disableControls: true });

    expect(result).toBe(`${videoSrc}?autoplay=1&controls=0`);
  });

  it('constructs URL with all parameters', () => {
    const videoSrc = 'http://youtube.com/video';
    const params = { videoSrc, autoplay: true, disableControls: true, loop: true, mute: true };

    const result = constructVideoUrl(params);

    expect(result).toBe(`${videoSrc}?autoplay=1&controls=0&loop=1&mute=1`);
  });

  it('constructs URL with parameters and existing query string', () => {
    const videoSrc = 'http://youtube.com/video?existing=value';
    const params = { videoSrc, autoplay: true, disableControls: true };

    const result = constructVideoUrl(params);

    expect(result).toBe(`${videoSrc}&autoplay=1&controls=0`);
  });

  it('handles case where videoSrc already has a query string', () => {
    const videoSrc = 'http://youtube.com/video?param=value';

    const result = constructVideoUrl({ videoSrc, autoplay: true });

    expect(result).toBe(`${videoSrc}&autoplay=1`);
  });

  it('throws an error if invalid videoSrc is provided', () => {
    const invalidVideoSrc = '';

    expect(() => {
      constructVideoUrl({ videoSrc: invalidVideoSrc, autoplay: true });
    }).toThrow('Invalid video source');
  });

  it('throws an error if invalid videoSrc is provided with wrong type', () => {
    const invalidVideoSrc = {};

    expect(() => {
      // @ts-ignore-next-line
      constructVideoUrl({ videoSrc: invalidVideoSrc, autoplay: true });
    }).toThrow("Can't construct video url");
  });

  it('constructs URL without query string when parameters are false', () => {
    const videoSrc = 'http://youtube.com/video';

    const result = constructVideoUrl({ videoSrc, autoplay: false, disableControls: false, loop: false, mute: false });

    expect(result).toBe(videoSrc);
  });
});
