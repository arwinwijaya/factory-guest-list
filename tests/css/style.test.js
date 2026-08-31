import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssPath = path.resolve(__dirname, '../../css/style.css');
let cssContent;

beforeAll(() => {
  cssContent = fs.readFileSync(cssPath, 'utf-8');
});

/**
 * Extracts CSS variable values from :root block
 */
function getRootVariables(css) {
  const rootMatch = css.match(/:root\s*\{([^}]+)\}/s);
  if (!rootMatch) return {};
  const block = rootMatch[1];
  const vars = {};
  const regex = /--([\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = regex.exec(block)) !== null) {
    vars[`--${m[1]}`] = m[2].trim();
  }
  return vars;
}

/**
 * Extracts style declarations for a given selector
 */
function getSelectorStyles(css, selector) {
  // Match selector { ... } blocks (non-greedy for nested braces)
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escaped}\\s*\\{([^}]+)\\}`, 's');
  const match = css.match(regex);
  if (!match) return null;
  const block = match[1];
  const styles = {};
  const propRegex = /([\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = propRegex.exec(block)) !== null) {
    styles[m[1]] = m[2].trim();
  }
  return styles;
}

describe('Theme Rebranding - GGF Brand Colors', () => {
  describe('Cycle 1: Header displays GGF green', () => {
    it('CSS variable --primary-color should be #006B3F (GGF green)', () => {
      const vars = getRootVariables(cssContent);
      expect(vars['--primary-color']).toBe('#006B3F');
    });

    it('CSS variable --bg-primary should be light (#f5f5f5)', () => {
      const vars = getRootVariables(cssContent);
      expect(vars['--bg-primary']).toBe('#f5f5f5');
    });

    it('CSS variable --bg-secondary should be #ffffff', () => {
      const vars = getRootVariables(cssContent);
      expect(vars['--bg-secondary']).toBe('#ffffff');
    });

    it('CSS variable --text-primary should be #333333', () => {
      const vars = getRootVariables(cssContent);
      expect(vars['--text-primary']).toBe('#333333');
    });

    it('CSS variable --text-secondary should be #666666', () => {
      const vars = getRootVariables(cssContent);
      expect(vars['--text-secondary']).toBe('#666666');
    });

    it('CSS variable --accent-orange should be #F5A623', () => {
      const vars = getRootVariables(cssContent);
      expect(vars['--accent-orange']).toBe('#F5A623');
    });

    it('CSS variable --accent-yellow should be #C4D600', () => {
      const vars = getRootVariables(cssContent);
      expect(vars['--accent-yellow']).toBe('#C4D600');
    });

    it('CSS variable --accent-blue should be #4ECDC4', () => {
      const vars = getRootVariables(cssContent);
      expect(vars['--accent-blue']).toBe('#4ECDC4');
    });
  });

  describe('Cycle 2: Status badges use brand colors', () => {
    it('.status-active should have background rgba(0, 107, 63, 0.2)', () => {
      const styles = getSelectorStyles(cssContent, '.status-active');
      expect(styles).not.toBeNull();
      expect(styles['background']).toBe('rgba(0, 107, 63, 0.2)');
    });

    it('.status-active should have color #006B3F', () => {
      const styles = getSelectorStyles(cssContent, '.status-active');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('#006B3F');
    });

    it('.status-active should have border #006B3F', () => {
      const styles = getSelectorStyles(cssContent, '.status-active');
      expect(styles).not.toBeNull();
      expect(styles['border']).toBe('1px solid #006B3F');
    });

    it('.status-ongoing should have background rgba(245, 166, 35, 0.2)', () => {
      const styles = getSelectorStyles(cssContent, '.status-ongoing');
      expect(styles).not.toBeNull();
      expect(styles['background']).toBe('rgba(245, 166, 35, 0.2)');
    });

    it('.status-ongoing should have color #F5A623', () => {
      const styles = getSelectorStyles(cssContent, '.status-ongoing');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('#F5A623');
    });

    it('.status-ongoing should have border #F5A623', () => {
      const styles = getSelectorStyles(cssContent, '.status-ongoing');
      expect(styles).not.toBeNull();
      expect(styles['border']).toBe('1px solid #F5A623');
    });

    it('.status-reschedule should have background rgba(196, 214, 0, 0.2)', () => {
      const styles = getSelectorStyles(cssContent, '.status-reschedule');
      expect(styles).not.toBeNull();
      expect(styles['background']).toBe('rgba(196, 214, 0, 0.2)');
    });

    it('.status-reschedule should have color #C4D600', () => {
      const styles = getSelectorStyles(cssContent, '.status-reschedule');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('#C4D600');
    });

    it('.status-reschedule should have border #C4D600', () => {
      const styles = getSelectorStyles(cssContent, '.status-reschedule');
      expect(styles).not.toBeNull();
      expect(styles['border']).toBe('1px solid #C4D600');
    });

    it('.status-cancel should have background rgba(78, 205, 196, 0.2)', () => {
      const styles = getSelectorStyles(cssContent, '.status-cancel');
      expect(styles).not.toBeNull();
      expect(styles['background']).toBe('rgba(78, 205, 196, 0.2)');
    });

    it('.status-cancel should have color #4ECDC4', () => {
      const styles = getSelectorStyles(cssContent, '.status-cancel');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('#4ECDC4');
    });

    it('.status-cancel should have border #4ECDC4', () => {
      const styles = getSelectorStyles(cssContent, '.status-cancel');
      expect(styles).not.toBeNull();
      expect(styles['border']).toBe('1px solid #4ECDC4');
    });
  });

  describe('Board status styles with text-shadow glow', () => {
    it('.board-status.status-active should have text-shadow glow', () => {
      const styles = getSelectorStyles(cssContent, '.board-status.status-active');
      expect(styles).not.toBeNull();
      expect(styles['text-shadow']).toBe('0 0 10px rgba(0, 107, 63, 0.5)');
      expect(styles['color']).toBe('#006B3F');
    });

    it('.board-status.status-ongoing should have text-shadow glow', () => {
      const styles = getSelectorStyles(cssContent, '.board-status.status-ongoing');
      expect(styles).not.toBeNull();
      expect(styles['text-shadow']).toBe('0 0 10px rgba(245, 166, 35, 0.5)');
      expect(styles['color']).toBe('#F5A623');
    });

    it('.board-status.status-reschedule should have text-shadow glow', () => {
      const styles = getSelectorStyles(cssContent, '.board-status.status-reschedule');
      expect(styles).not.toBeNull();
      expect(styles['text-shadow']).toBe('0 0 10px rgba(196, 214, 0, 0.5)');
      expect(styles['color']).toBe('#C4D600');
    });

    it('.board-status.status-cancel should have text-shadow glow', () => {
      const styles = getSelectorStyles(cssContent, '.board-status.status-cancel');
      expect(styles).not.toBeNull();
      expect(styles['text-shadow']).toBe('0 0 10px rgba(78, 205, 196, 0.5)');
      expect(styles['color']).toBe('#4ECDC4');
    });
  });

  describe('Refactor: old status styles removed', () => {
    it('should not contain .status-menunggu', () => {
      expect(cssContent).not.toContain('.status-menunggu');
    });

    it('should not contain .status-meeting', () => {
      expect(cssContent).not.toContain('.status-meeting');
    });

    it('should not contain .status-selesai', () => {
      expect(cssContent).not.toContain('.status-selesai');
    });
  });
});
