[![pages-build-deployment](https://github.com/Stukongeluk/stukongeluk.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/Stukongeluk/stukongeluk.github.io/actions/workflows/pages/pages-build-deployment)
# Jimmy Nguyen - Personal Website 🚀

Welcome to my personal portfolio website! This project showcases my journey, skills, and projects as a Senior DevOps Engineer & Full-Stack Developer with 10 years of software craftsmanship and Forward Deploy capabilities.

## ✨ Features

- **⚡ Super Saiyan Mode**: A hidden Easter egg! Click my profile picture in the hero section to see the entire site transform into a golden Super Saiyan theme.
- **🌗 Daylight & Evening Mode**: light by default, with a warm dark mode you can switch on.
- **🎨 Japandi Design**: light washi-paper and wood palette, an animated bonsai and hanging scroll, and calm scroll animations that respect reduced-motion settings.
- **📱 Mobile First**: fully responsive layout ensuring a great experience on any device.

## 🛠️ Tech Stack

This project is built with the latest modern web technologies:

- **[Angular v18](https://angular.io/)**: Utilizing standalone components, signals, and the new application builder for maximum performance.
- **[Tailwind CSS v3](https://tailwindcss.com/)**: For rapid, utility-first styling and custom design systems.
- **[TypeScript](https://www.typescriptlang.org/)**: ensuring type safety and robust code.
- **GitHub Pages**: built and deployed by a GitHub Actions workflow on every push to `main`.

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