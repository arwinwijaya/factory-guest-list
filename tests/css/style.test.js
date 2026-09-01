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

  describe('Cycle 2: Status badges use brand colors (no box)', () => {
    it('.status-active should have color var(--primary-color)', () => {
      const styles = getSelectorStyles(cssContent, '.status-active');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('var(--primary-color)');
    });

    it('.status-active should NOT have background', () => {
      const styles = getSelectorStyles(cssContent, '.status-active');
      expect(styles).not.toBeNull();
      expect(styles['background']).toBeUndefined();
    });

    it('.status-active should NOT have border', () => {
      const styles = getSelectorStyles(cssContent, '.status-active');
      expect(styles).not.toBeNull();
      expect(styles['border']).toBeUndefined();
    });

    it('.status-ongoing should have color var(--accent-orange)', () => {
      const styles = getSelectorStyles(cssContent, '.status-ongoing');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('var(--accent-orange)');
    });

    it('.status-ongoing should NOT have background', () => {
      const styles = getSelectorStyles(cssContent, '.status-ongoing');
      expect(styles).not.toBeNull();
      expect(styles['background']).toBeUndefined();
    });

    it('.status-ongoing should NOT have border', () => {
      const styles = getSelectorStyles(cssContent, '.status-ongoing');
      expect(styles).not.toBeNull();
      expect(styles['border']).toBeUndefined();
    });

    it('.status-reschedule should have color var(--accent-yellow)', () => {
      const styles = getSelectorStyles(cssContent, '.status-reschedule');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('var(--accent-yellow)');
    });

    it('.status-reschedule should NOT have background', () => {
      const styles = getSelectorStyles(cssContent, '.status-reschedule');
      expect(styles).not.toBeNull();
      expect(styles['background']).toBeUndefined();
    });

    it('.status-reschedule should NOT have border', () => {
      const styles = getSelectorStyles(cssContent, '.status-reschedule');
      expect(styles).not.toBeNull();
      expect(styles['border']).toBeUndefined();
    });

    it('.status-cancel should have color var(--accent-blue)', () => {
      const styles = getSelectorStyles(cssContent, '.status-cancel');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('var(--accent-blue)');
    });

    it('.status-cancel should NOT have background', () => {
      const styles = getSelectorStyles(cssContent, '.status-cancel');
      expect(styles).not.toBeNull();
      expect(styles['background']).toBeUndefined();
    });

    it('.status-cancel should NOT have border', () => {
      const styles = getSelectorStyles(cssContent, '.status-cancel');
      expect(styles).not.toBeNull();
      expect(styles['border']).toBeUndefined();
    });
  });

  describe('Board status styles with bold colored text', () => {
    it('.board-status.status-active should have color var(--primary-color)', () => {
      const styles = getSelectorStyles(cssContent, '.board-status.status-active');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('var(--primary-color)');
    });

    it('.board-status.status-ongoing should have color var(--accent-orange)', () => {
      const styles = getSelectorStyles(cssContent, '.board-status.status-ongoing');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('var(--accent-orange)');
    });

    it('.board-status.status-reschedule should have color var(--accent-yellow)', () => {
      const styles = getSelectorStyles(cssContent, '.board-status.status-reschedule');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('var(--accent-yellow)');
    });

    it('.board-status.status-cancel should have color var(--accent-blue)', () => {
      const styles = getSelectorStyles(cssContent, '.board-status.status-cancel');
      expect(styles).not.toBeNull();
      expect(styles['color']).toBe('var(--accent-blue)');
    });
  });

  describe('Navbar links aligned to the right', () => {
    it('.navbar .nav-links should have margin-left: auto', () => {
      const styles = getSelectorStyles(cssContent, '.navbar .nav-links');
      expect(styles).not.toBeNull();
      expect(styles['margin-left']).toBe('auto');
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
