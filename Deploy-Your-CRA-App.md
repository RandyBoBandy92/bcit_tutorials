# Deploying Your Create React App Project
This guide will help you deploy your Create React App project, a movie database named 'movie-mania'. You will configure your app to work with your server and handle "virtual" URLs.

## Step 1: Set a Global App Folder Name
Firstly, you need to define a global variable for your app folder name. You can use any method you prefer to create this global variable. In this example, we'll set the variable APP_FOLDER_NAME.

If you don't have a `globals.js` file, create one in your `src` folder. Then, add the following code to it:

```js
export const APP_FOLDER_NAME = "movie-mania";
```

## Step 2: Add the basename attribute to BrowserRouter
Modify the BrowserRouter in your App.js file (or wherever your router is defined) to include a basename attribute, like so:

```js
import { APP_FOLDER_NAME } from "./globals";
<BrowserRouter basename={`/${APP_FOLDER_NAME}`}>
```

This basename attribute tells the router that all its routes should be relative to this base URL.

## Step 3: Modify package.json
Next, update your package.json file to include a homepage attribute. This attribute tells Create React App where the app is being hosted.

Here is an example package.json, yours will look similar to this:

```json
{
  "name": "movie-mania",
  "version": "0.1.0",
  "private": true,
  "homepage": "/movie-mania",
  "dependencies": {
    ...
  },
}
```

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
- Upload the contents of the build folder to your server via FTP.
- Rename the build folder to the name of your app you defined in Step 1.

