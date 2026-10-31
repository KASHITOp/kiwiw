# Licenses

Kiwiw is released under the [MIT License](LICENSE).

## Third-party dependencies

Kiwiw is built on open-source software. The primary runtime dependencies and
their licenses are listed below. Each remains under its own license; this list
is a convenience summary, not a substitute for those licenses.

| Package | Purpose | License |
| --- | --- | --- |
| [react](https://github.com/facebook/react) · react-dom | UI runtime | MIT |
| [react-router-dom](https://github.com/remix-run/react-router) | Routing | MIT |
| [zustand](https://github.com/pmndrs/zustand) | State management | MIT |
| [lucide-react](https://github.com/lucide-icons/lucide) | Icons | ISC |
| [html-to-image](https://github.com/bubkoo/html-to-image) | PNG export | MIT |
| [@fontsource/inter](https://github.com/fontsource/font-files) | Inter web font packaging | MIT |
| [Inter](https://github.com/rsms/inter) (the typeface itself) | Typography | SIL Open Font License 1.1 |
| [vite](https://github.com/vitejs/vite) | Build tool / dev server | MIT |
| [typescript](https://github.com/microsoft/TypeScript) | Language tooling | Apache-2.0 |

## Assets & content

- All templates, colors and sample copy shipped in Kiwiw are original to this
  project.
- The demo photo library uses [picsum.photos](https://picsum.photos) placeholders
  by default; real photo search is powered by [Pexels](https://www.pexels.com)
  when an API key is supplied, under the Pexels license.

Run `npm run build` and inspect `node_modules` for the full, authoritative
license text of every transitive dependency.
