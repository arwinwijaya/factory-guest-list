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

describe('UX Enhancement - Search Bar Styles', () => {
  it('.search-container should exist with display: flex', () => {
    const styles = getSelectorStyles(cssContent, '.search-container');
    expect(styles).not.toBeNull();
    expect(styles['display']).toBe('flex');
  });

  it('.search-container should have align-items: center', () => {
    const styles = getSelectorStyles(cssContent, '.search-container');
    expect(styles).not.toBeNull();
    expect(styles['align-items']).toBe('center');
  });

  it('.search-input should have border style', () => {
    const styles = getSelectorStyles(cssContent, '.search-input');
    expect(styles).not.toBeNull();
    expect(styles['border']).toBeDefined();
  });

  it('.search-input should have border-radius: 4px', () => {
    const styles = getSelectorStyles(cssContent, '.search-input');
    expect(styles).not.toBeNull();
    expect(styles['border-radius']).toBe('4px');
  });

  it('.search-icon should have color #999999', () => {
    const styles = getSelectorStyles(cssContent, '.search-icon');
    expect(styles).not.toBeNull();
    expect(styles['color']).toBe('#999999');
  });
});

describe('UX Enhancement - Pagination Styles', () => {
  it('.pagination-container should exist with display: flex', () => {
    const styles = getSelectorStyles(cssContent, '.pagination-container');
    expect(styles).not.toBeNull();
    expect(styles['display']).toBe('flex');
  });

  it('.pagination-container should have justify-content: space-between', () => {
    const styles = getSelectorStyles(cssContent, '.pagination-container');
    expect(styles).not.toBeNull();
    expect(styles['justify-content']).toBe('space-between');
  });

  it('.pagination-info should have font-size: 12px', () => {
    const styles = getSelectorStyles(cssContent, '.pagination-info');
    expect(styles).not.toBeNull();
    expect(styles['font-size']).toBe('12px');
  });

  it('.pagination-controls should have display: flex', () => {
    const styles = getSelectorStyles(cssContent, '.pagination-controls');
    expect(styles).not.toBeNull();
    expect(styles['display']).toBe('flex');
  });

  it('.page-btn.active should have border style with primary color', () => {
    const styles = getSelectorStyles(cssContent, '.page-btn.active');
    expect(styles).not.toBeNull();
    expect(styles['border']).toBeDefined();
  });
});

describe('UX Enhancement - Modal Styles', () => {
  it('.modal-overlay should exist with position: fixed', () => {
    const styles = getSelectorStyles(cssContent, '.modal-overlay');
    expect(styles).not.toBeNull();
    expect(styles['position']).toBe('fixed');
  });

  it('.modal-overlay should have background with opacity', () => {
    const styles = getSelectorStyles(cssContent, '.modal-overlay');
    expect(styles).not.toBeNull();
    expect(styles['background']).toBeDefined();
  });

  it('.modal-container should have border-radius: 4px', () => {
    const styles = getSelectorStyles(cssContent, '.modal-container');
    expect(styles).not.toBeNull();
    expect(styles['border-radius']).toBe('4px');
  });

  it('.modal-container should have box-shadow', () => {
    const styles = getSelectorStyles(cssContent, '.modal-container');
    expect(styles).not.toBeNull();
    expect(styles['box-shadow']).toBeDefined();
  });

  it('.modal-header should have border-bottom', () => {
    const styles = getSelectorStyles(cssContent, '.modal-header');
    expect(styles).not.toBeNull();
    expect(styles['border-bottom']).toBeDefined();
  });

  it('.modal-footer should have display: flex', () => {
    const styles = getSelectorStyles(cssContent, '.modal-footer');
    expect(styles).not.toBeNull();
    expect(styles['display']).toBe('flex');
  });

  it('.modal-footer should have justify-content: flex-end', () => {
    const styles = getSelectorStyles(cssContent, '.modal-footer');
    expect(styles).not.toBeNull();
    expect(styles['justify-content']).toBe('flex-end');
  });
});

describe('UX Enhancement - Loading Spinner Styles', () => {
  it('.loading-container should exist with display: flex', () => {
    const styles = getSelectorStyles(cssContent, '.loading-container');
    expect(styles).not.toBeNull();
    expect(styles['display']).toBe('flex');
  });

  it('.loading-container should have justify-content: center', () => {
    const styles = getSelectorStyles(cssContent, '.loading-container');
    expect(styles).not.toBeNull();
    expect(styles['justify-content']).toBe('center');
  });

  it('.loading-spinner should have width: 32px', () => {
    const styles = getSelectorStyles(cssContent, '.loading-spinner');
    expect(styles).not.toBeNull();
    expect(styles['width']).toBe('32px');
  });

  it('.loading-spinner should have height: 32px', () => {
    const styles = getSelectorStyles(cssContent, '.loading-spinner');
    expect(styles).not.toBeNull();
    expect(styles['height']).toBe('32px');
  });

  it('.loading-spinner should have border-radius: 50%', () => {
    const styles = getSelectorStyles(cssContent, '.loading-spinner');
    expect(styles).not.toBeNull();
    expect(styles['border-radius']).toBe('50%');
  });
});

describe('UX Enhancement - Table Controls Styles', () => {
  it('.table-controls should exist with display: flex', () => {
    const styles = getSelectorStyles(cssContent, '.table-controls');
    expect(styles).not.toBeNull();
    expect(styles['display']).toBe('flex');
  });

  it('.table-controls should have justify-content: space-between', () => {
    const styles = getSelectorStyles(cssContent, '.table-controls');
    expect(styles).not.toBeNull();
    expect(styles['justify-content']).toBe('space-between');
  });
});
