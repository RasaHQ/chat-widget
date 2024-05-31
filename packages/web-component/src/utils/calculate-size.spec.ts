import { Size, calculateSize } from './calculate-size';

describe('calculateSize', () => {
  it('maintain aspect ratio for a square image', () => {
    const oldWidth = 100;
    const oldHeight = 100;
    const targetSize = 50;
    const expected: Size = { width: 50, height: 50 };
    const result = calculateSize(oldWidth, oldHeight, targetSize);

    expect(result).toEqual(expected);
  });

  it('maintain aspect ratio for a landscape image', () => {
    const oldWidth = 200;
    const oldHeight = 100;
    const targetSize = 50;
    const expected: Size = { width: 50, height: 25 };
    const result = calculateSize(oldWidth, oldHeight, targetSize);

    expect(result).toEqual(expected);
  });

  it('maintain aspect ratio for a portrait image', () => {
    const oldWidth = 100;
    const oldHeight = 200;
    const targetSize = 50;
    const expected: Size = { width: 25, height: 50 };
    const result = calculateSize(oldWidth, oldHeight, targetSize);

    expect(result).toEqual(expected);
  });

  it('maintain aspect ratio for a tiny target size', () => {
    const oldWidth = 300;
    const oldHeight = 150;
    const targetSize = 10;
    const expected: Size = { width: 10, height: 5 };
    const result = calculateSize(oldWidth, oldHeight, targetSize);

    expect(result).toEqual(expected);
  });

  it('maintain aspect ratio for a large target size', () => {
    const oldWidth = 100;
    const oldHeight = 200;
    const targetSize = 1000;
    const expected: Size = { width: 500, height: 1000 };
    const result = calculateSize(oldWidth, oldHeight, targetSize);

    expect(result).toEqual(expected);
  });
});
