import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import { resolve } from 'path';

const root = resolve(import.meta.dirname, '../../');

function loadPage(filename) {
  const html = readFileSync(resolve(root, filename), 'utf-8');
  const dom = new JSDOM(html, { url: `http://localhost/${filename}` });
  return dom.window.document;
}

function loadCSS() {
  return readFileSync(resolve(root, 'css/style.css'), 'utf-8');
}

const pages = ['login.html', 'admin.html', 'display.html'];

// ============================================
// Cycle 1: Navigation bar appears on all pages
// ============================================
describe('Navigation bar appears on all pages', () => {
  pages.forEach((page) => {
    it(`Given the user is on the ${page} page, When the page renders, Then the navigation bar is visible with GGF logo`, () => {
      const doc = loadPage(page);
      const navbar = doc.querySelector('nav.navbar');
      expect(navbar).not.toBeNull();
      const logo = navbar.querySelector('img.logo');
      expect(logo).not.toBeNull();
      expect(logo.getAttribute('alt')).toContain('GGF');
    });
  });
});

// ============================================
// Cycle 2: Current page is highlighted
// ============================================
describe('Current page is highlighted', () => {
  const expectedActive = {
    'login.html': 'login.html',
    'admin.html': 'admin.html',
    'display.html': 'display.html',
  };

  pages.forEach((page) => {
    it(`Given the user is on the ${page} page, When the navigation renders, Then the corresponding link has class "active"`, () => {
      const doc = loadPage(page);
      const activeLink = doc.querySelector('.nav-link.active');
      expect(activeLink).not.toBeNull();
      expect(activeLink.getAttribute('href')).toBe(expectedActive[page]);
    });
  });
});

// ============================================
// Cycle 3: Navigation collapses on mobile
// ============================================
describe('Navigation collapses on mobile', () => {
  it(`Given the CSS file is loaded, When we check for responsive rules, Then @media (max-width: 768px) exists with .nav-hamburger display block and .nav-links display none`, () => {
    const css = loadCSS();
    // Check that the media query exists
    expect(css).toMatch(/@media\s*\(\s*max-width:\s*768px\s*\)/);
    // Check that within the CSS, .nav-hamburger has display: block (somewhere, not necessarily in media query)
    expect(css).toMatch(/\.nav-hamburger[\s\S]*display\s*:\s*block/);
    // Check that .nav-links display: none exists (for mobile collapse)
    expect(css).toMatch(/\.nav-links[\s\S]*display\s*:\s*none/);
  });
});

// ============================================
// Cycle 4: Navigation links have correct href attributes
// ============================================
describe('Navigation links have correct href attributes', () => {
  pages.forEach((page) => {
    it(`Given the navigation renders on ${page}, When we check the links, Then href attributes contain login.html, admin.html, display.html`, () => {
      const doc = loadPage(page);
      const links = doc.querySelectorAll('.nav-link');
      const hrefs = Array.from(links).map((a) => a.getAttribute('href'));
      expect(hrefs).toContain('login.html');
      expect(hrefs).toContain('admin.html');
      expect(hrefs).toContain('display.html');
    });
  });
});
