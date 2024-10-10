import { isValidURL } from './validate-url';

describe('isValidURL', () => {
  it('Valid URLs', () => {
    expect(isValidURL('https://www.example.com')).toBe(true);
    expect(isValidURL('http://example.com')).toBe(true);
    expect(isValidURL('http://example')).toBe(true);  // Dotless domain name could be configured in an internal network.
    expect(isValidURL('https://subdomain.example.com')).toBe(true);
    expect(isValidURL('http://192.168.1.1')).toBe(true);
    expect(isValidURL('http://example.com:8080/path')).toBe(true);
    expect(isValidURL('https://example.com/path?name=value#anchor')).toBe(true);
    expect(isValidURL('http://localhost:8081')).toBe(true);
    expect(isValidURL('http://nested.subdomain.example.com')).toBe(true);
    expect(isValidURL('https://nested.subdomain.example.com')).toBe(true);
    expect(isValidURL('http://nested-subdomain.with-hyphen.special-example.com')).toBe(true);
    expect(isValidURL('https://nested-subdomain.with-hyphen.special-example.com')).toBe(true);
  });

  it('Invalid URLs', () => {
    expect(isValidURL('ftp://example.com')).toBe(false);
    expect(isValidURL('htp://example.com')).toBe(false);
    expect(isValidURL('://example.com')).toBe(false);
    expect(isValidURL('http://')).toBe(false);
    expect(isValidURL('example.com')).toBe(false);
    expect(isValidURL('invalid-url')).toBe(false);
  });
});