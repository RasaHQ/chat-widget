import { formatDateTime } from "./format-datetime";

describe('formatDateTime', () => {
  it('formats date correctly', () => {
    const date = new Date('2023-04-25T15:45:30');
    const formattedDate = formatDateTime(date);
    expect(formattedDate).toBe('25 Apr 2023, 3:45:30 PM');
  });

  it('formats date at noon correctly', () => {
    const date = new Date('2023-04-25T12:00:00');
    const formattedDate = formatDateTime(date);
    expect(formattedDate).toBe('25 Apr 2023, 12:00:00 PM');
  });

  it('formats date at midnight correctly', () => {
    const date = new Date('2023-04-25T00:00:00');
    const formattedDate = formatDateTime(date);
    expect(formattedDate).toBe('25 Apr 2023, 12:00:00 AM');
  });

  it('formats date in the morning correctly', () => {
    const date = new Date('2023-04-25T07:30:45');
    const formattedDate = formatDateTime(date);
    expect(formattedDate).toBe('25 Apr 2023, 7:30:45 AM');
  });

  it('handles single-digit days and months', () => {
    const date = new Date('2023-01-05T10:05:09');
    const formattedDate = formatDateTime(date);
    expect(formattedDate).toBe('5 Jan 2023, 10:05:09 AM');
  });

  it('handles empty argument', () => {
    // @ts-ignore-next-line
    expect(() => formatDateTime()).toThrow('Date not found');
  });

  it('handles non date object argument', () => {
    // @ts-ignore-next-line
    expect(() => formatDateTime('some text')).toThrow('formatDateTime: Invalid time object - arg:some text, TypeError: date.getDate is not a function');
  });
});
