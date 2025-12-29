/**
 * GitKraken inspired color theme
 * Dark theme with navy/charcoal base
 */

export const gitKrakenTheme = {
  // Base colors
  background: {
    primary: '#1e1e1e',      // Main background
    secondary: '#252526',    // Sidebar background
    tertiary: '#2d2d30',     // Toolbar background
    hover: '#2a2d2e',        // Hover state
    active: '#37373d',       // Active/selected state
  },

  // Text colors
  text: {
    primary: '#cccccc',      // Main text
    secondary: '#9d9d9d',    // Secondary text
    muted: '#6e6e6e',        // Muted text
    bright: '#ffffff',       // Bright text (headings)
  },

  // Accent colors (neon for dark theme)
  accent: {
    blue: '#4fc3f7',         // Primary action
    green: '#66bb6a',        // Success/commits
    orange: '#ffa726',       // Warning
    red: '#ef5350',          // Error/delete
    purple: '#ab47bc',       // Secondary
    cyan: '#26c6da',         // Info
    yellow: '#ffee58',       // Highlight
  },

  // Branch colors (brighter for visibility)
  branch: {
    main: '#4fc3f7',         // Bright blue
    develop: '#ab47bc',      // Purple
    feature: '#66bb6a',      // Green
    hotfix: '#ef5350',       // Red
    release: '#ffa726',      // Orange
    bugfix: '#ffee58',       // Yellow
  },

  // Border colors
  border: {
    primary: '#3e3e42',      // Main borders
    secondary: '#2d2d30',    // Subtle borders
    highlight: '#4fc3f7',    // Highlight border
  },

  // Graph specific
  graph: {
    line: 'rgba(255, 255, 255, 0.3)',  // Commit lines
    node: '#4fc3f7',                    // Commit nodes
    nodeBorder: '#ffffff',              // Node borders
  },
};

export type GitKrakenTheme = typeof gitKrakenTheme;
