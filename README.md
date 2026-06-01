# Vite Framework

`@liquidlight/vite-framework` is an opinionated Vite configuration package for TYPO3 projects. It wraps and pre-configures a standard set of Vite plugins and PostCSS tools so you don't have to repeat boilerplate across projects.

What it provides out of the box:

- TYPO3 integration via `vite-plugin-typo3` for asset manifest handling
- SVG spritemap generation (`@spiriit/vite-plugin-svg-spritemap`), with automatic `px → em` conversion in generated Sass variables/mixins
- PostCSS pipeline: autoprefixer, custom media queries, media query sorting, and CSS minification (cssnano)
- Sass support with Composer vendor paths pre-resolved so TYPO3 site-package Sass can be imported directly
- A `liquidlight/` path alias resolving into `vendor/liquidlight/` for clean cross-extension imports

**For installation & usage, see the [📚 Documentation](https://liquidlight.github.io/vite-framework/).**
