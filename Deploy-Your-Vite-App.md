# Deploying Your Vite App Project
This guide will help you deploy your Vite App project, a movie database named 'movie-mania'. You will configure your app to work with your server and handle "virtual" URLs.

## Step 1: Set a Global App Folder Name
Firstly, you need to define a global variable for your app folder name. You can use any method you prefer to create this global variable. In this example, we'll set the variable APP_FOLDER_NAME.

If you don't have a `globals.js` file, create one in your `src` folder. Then, add the following code to it:

```js
export const APP_FOLDER_NAME = "movie-mania";
```

or if you already have other global variables defined, add the following line to it:

```js
const APP_FOLDER_NAME = "movie-mania";
const OTHER_GLOBAL = "other-global";
export { APP_FOLDER_NAME, OTHER_GLOBAL}
```

## Step 2: Add the basename attribute to BrowserRouter
Modify the BrowserRouter in your App.js file (or wherever your router is defined) to include a basename attribute, like so:

```js
import { APP_FOLDER_NAME } from "./globals";
<BrowserRouter basename={`/${APP_FOLDER_NAME}`}>
```

This basename attribute tells the router that all its routes should be relative to this base URL.

## Step 3: Modify vite.config.js

In Vite, you need to add the base and build.outDir properties to vite.config.js instead of modifying package.json. Here's how you can do it:

```js
export default defineConfig({
  base: '/movie-mania/',
  build: {
    outDir: 'movie-mania'
  },
  plugins: [reactRefresh()],
})
```

NOTE: Your config file may look slightly different than this, the important parts to add are `base` and `build`.

## Step 4: Configure Server to Handle Virtual URLs
Your server needs to be configured to handle "virtual" URLs. These are URLs that do not map to actual files, but are instead handled by your React app.

Create a .htaccess file in your project's public/ folder with the following content:
```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

This configuration will redirect all requests to your index.html file, allowing your React app to handle the routing.

Note: The .htaccess file should not be placed in the root directory of your domain, but nested inside the directory of your React project.

After following these steps, your React application should be ready for deployment!

## Step 5: Deploying to siteground via FTP

- Running `npm run build` will create a build folder with a production build of your app.
- Upload the contents of the build folder to your server via FTP. (double check that the folder name is an exact match of the `base` and `basename` variables you defined previously.
