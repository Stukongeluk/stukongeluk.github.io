[![Deploy site to GitHub Pages](https://github.com/Stukongeluk/stukongeluk.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Stukongeluk/stukongeluk.github.io/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fjimmynguyen.nl&label=jimmynguyen.nl)](https://jimmynguyen.nl)
[![Angular 21](https://img.shields.io/badge/Angular-21-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Node.js 22](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
# Jimmy Nguyen - Personal Website 🚀

Welcome to my personal portfolio website! This project showcases my journey, skills, and projects as a Senior DevOps Engineer & Full-Stack Developer with 10 years of software craftsmanship and Forward Deploy capabilities.

## ✨ Features

- **⚡ Super Saiyan Easter Egg**: Click my pixel-art portrait in the hero hanging scroll to transform—and keep clicking to go even further beyond (**Super Saiyan → SSJ2 → SSJ3 → Super Saiyan God → Super Saiyan Blue → Ultra Instinct Sign → Mastered Ultra Instinct**). Each stage unlocks a custom portrait (down to the Goku coffee mug), matching aura, scouter reading, vertical calligraphy, and full-site Japandi theme palette, with subtle stage dots and one-click (or `Esc`) power-down back to Base.
- **🌗 Daylight & Evening Mode**: Light by default, with a warm dark mode you can switch on—including Daylight and Evening variants across every transformed theme.
- **🎨 Japandi Design**: Washi-paper and oak palette, animated bonsai and parting leaf canopies, a hanging kakejiku scroll, and calm scroll animations that respect reduced-motion settings.
- **📱 Mobile First**: Fully responsive layout ensuring a great experience on any device.

## 🛠️ Tech Stack

This project is built with modern web technologies:

- **[Angular 21](https://angular.dev/)**: Standalone components, signals, and static prerendering (`@angular/ssr`) for fast loads and SEO.
- **[Tailwind CSS v3](https://tailwindcss.com/)**: Utility-first styling paired with custom CSS tokens for Japandi and transformation themes.
- **[TypeScript](https://www.typescriptlang.org/)**: End-to-end type safety.
- **GitHub Pages**: Built and deployed by a GitHub Actions workflow on every push to `main`.

## 🚀 Getting Started

Follow these steps to run the project locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Stukongeluk/stukongeluk.github.io.git
   cd stukongeluk.github.io/website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

4. **Build for production**
   ```bash
   npx ng build
   ```
   The prerendered site is written to `website/docs/browser` (not committed).

## 🚢 Deployment

Every push to `main` that touches `website/` is built and published to GitHub Pages by the
[Deploy site to GitHub Pages](.github/workflows/deploy.yml) workflow. There is no build script
to run and no compiled output to commit. You can also start a deploy by hand from the Actions tab.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
