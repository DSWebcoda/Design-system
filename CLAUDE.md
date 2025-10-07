# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive design system built as a static HTML/CSS/JavaScript application. The system provides a unified set of design principles, components, and guidelines for consistent product development. It features a complete design token system imported from Figma with primitive and semantic token mappings.

## Development Commands

Since this is a static site, no build process or package management is required. Development is done by editing files directly and serving through a simple HTTP server:

```bash
# Serve the design system locally
python3 -m http.server 8000
# Access at http://localhost:8000

# Alternative with Node.js (if available)
npx live-server --port=8080
```

## Architecture

### File Structure
```
/
├── index.html           # Main design system interface
├── styles/
│   ├── tokens.css       # Design tokens from Figma (primitive + semantic)
│   └── main.css         # Component styling and layout
└── scripts/
    └── main.js          # Navigation and interactive functionality
```

### Design Token System

The design system implements a two-tier token architecture:

1. **Primitive Tokens** (`styles/tokens.css`): Raw values imported from Figma
   - 8 color families: Deep Blue, Turquoise, Sunshine, Bridge Grey, Harbour Blue, Granite, plus neutral foundation colors
   - Typography tokens using Funnel Display font family
   - Spacing scale based on 4px increments
   - Border radius values

2. **Semantic Tokens**: Mapped to primitive tokens for specific use cases
   - Text colors (`--text-primary`, `--text-secondary`, etc.)
   - Background colors (`--bkg-base-primary`, `--bkg-dark-primary`, etc.)
   - Button color mappings for all variants
   - Icon and border color tokens

### Component System

Components are organized into sections accessible via sidebar navigation:
- **Tokens**: Interactive token reference with copy-to-clipboard functionality
- **Colors**: Visual color palette display
- **Typography**: Font family, weights, and size scale
- **Spacing**: Spacing scale and border radius demonstrations
- **Buttons**: Multiple button variants with states (normal, hover, disabled)
- **Forms**: Input fields, textareas, and form validation states
- **Cards**: Content card layouts
- **Icons**: Icon system examples

### Interactive Features

The JavaScript (`scripts/main.js`) handles:
- Single-page navigation between design system sections
- Token copy-to-clipboard functionality with visual feedback
- Button ripple effects and hover demonstrations
- Mobile navigation toggle
- Search functionality for navigation items

### Design Token Integration

When adding new components:
1. Use existing semantic tokens from `styles/tokens.css`
2. If new tokens are needed, add them to the semantic mappings section
3. Maintain the primitive → semantic → component hierarchy
4. Update the tokens page with usage references showing where tokens are applied

### Figma Integration

The system integrates with Figma through MCP (Model Context Protocol) servers:
- Local Figma Dev Mode server: `http://127.0.0.1:3845/mcp`
- OpenAPI adapter for Figma REST API access
- Configured for BridgeMuseum design file access

### Adding New Components

1. Add navigation link in the sidebar (`index.html`)
2. Create new section with appropriate semantic markup
3. Implement styling using existing design tokens
4. Add interactive behavior in `main.js` if needed
5. Update the tokens page with any new token usage references

### Token Usage References

The tokens page includes usage references showing how primitive tokens map to semantic applications. When updating components, maintain these cross-references to help developers understand the token system hierarchy.