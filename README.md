# Weather App Boilerplate (Vite + React + JavaScript + Tailwind)

This is a starter boilerplate for a frontend-only weather application using:

- Vite + React (JavaScript)
- Tailwind CSS
- TanStack Query (@tanstack/react-query) for data fetching & caching
- Recharts for charts
- OpenWeather API (you need an API key)

## Quick start

1. Unzip the project and `cd` into the folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file at the project root with:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```
4. Run the dev server:
   ```bash
   npm run dev
   ```
5. Open the app at the printed local URL.

## Notes / Next steps

- This project uses `fetch` and expects `VITE_OPENWEATHER_API_KEY` env var.
- `shadcn/ui` is not installed here — shadcn is typically added by generating components.
  You can either:
  - Use the small `src/components/ui/` area to add your own components styled with Tailwind, or
  - Follow shadcn's docs to integrate their toolchain into this project after installing Node dependencies.

- For production builds, configure environment variables in your hosting platform.

Happy building! 🚀

## Added features in full bundle

- Favorites (Context + localStorage) — add/remove favorite cities from the WeatherCard.
- Simple `ui/` components (Button, Card) that act like shadcn-style components (Tailwind-based).
- Framer Motion animations for subtle UI motion.
- Leaflet map component (WeatherMap) using react-leaflet to show city location on map.
  - Note: Leaflet images are loaded from CDN in the component; react-leaflet and leaflet are included in package.json.
  - You may need to run `npm install` to fetch these packages.

## Run notes

After unzipping:
1. Install deps:
   ```
   npm install
   ```
2. Create `.env` with your OpenWeather API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_key_here
   ```
3. Start dev server:
   ```
   npm run dev
   ```

If you encounter Leaflet CSS/icon issues in build, ensure `leaflet` CSS is imported in components or globally:
```css
@import 'leaflet/dist/leaflet.css';
```
