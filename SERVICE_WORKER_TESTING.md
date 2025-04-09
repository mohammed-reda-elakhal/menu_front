# Service Worker Testing Guide for Meniwi

This guide will help you test the service worker implementation in the Meniwi application to ensure it's working correctly for offline capabilities and caching.

## What is a Service Worker?

A service worker is a script that your browser runs in the background, separate from a web page, enabling features that don't need a web page or user interaction. Some key features include:

- **Offline functionality**: Allow your app to work without an internet connection
- **Caching resources**: Speed up load times by serving cached resources
- **Push notifications**: Enable push notifications for your web app
- **Background sync**: Perform actions even when the app is not open

## Testing the Service Worker

### 1. Using the Built-in Test Page

The easiest way to test the service worker is to use the built-in test page:

1. Navigate to `/sw-test` in your application
2. The page will show the current status of the service worker
3. Use the provided buttons to:
   - Register the service worker
   - Unregister the service worker
   - Clear the cache
   - Test offline mode

### 2. Manual Testing with Chrome DevTools

For more detailed testing, you can use Chrome DevTools:

1. Open your application in Chrome
2. Open DevTools (F12 or right-click > Inspect)
3. Go to the "Application" tab
4. In the left sidebar, under "Application", select "Service Workers"

Here you can see:
- If a service worker is registered
- The status of the service worker
- Options to update, unregister, or skip the waiting phase

#### Testing Offline Mode

1. In Chrome DevTools, go to the "Network" tab
2. Check the "Offline" checkbox
3. Refresh the page
4. You should see the offline page instead of a browser error

#### Testing Caching

1. Load several pages of the application while online
2. In Chrome DevTools, go to the "Application" tab
3. In the left sidebar, under "Cache", select "Cache Storage"
4. Click on "meniwi-cache-v1" to see what resources are cached
5. Go offline and try to access those pages - they should load from cache

### 3. Testing on Mobile Devices

To test on mobile devices:

1. Deploy your application to a server with HTTPS (required for service workers)
2. Access the application on your mobile device
3. Use the browser's developer tools or the built-in test page to verify the service worker is registered
4. Put your device in airplane mode to test offline functionality

## Common Issues and Troubleshooting

### Service Worker Not Registering

- Service workers require HTTPS (except on localhost for development)
- Check the browser console for errors during registration
- Make sure the service worker file is in the correct location (root of the public directory)

### Caching Not Working

- Check if the service worker is properly registered and activated
- Verify the cache name matches what's expected in the code
- Check the network tab to see if resources are being served from the cache

### Offline Mode Not Working

- Make sure the service worker is properly registered and activated
- Verify that the offline page is properly cached
- Check if the fetch event handler is correctly configured to serve the offline page

## Additional Resources

- [MDN Web Docs: Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Google Developers: Service Workers](https://developers.google.com/web/fundamentals/primers/service-workers)
- [Workbox: Service Worker Libraries](https://developers.google.com/web/tools/workbox)

## PWA Installation Testing

To test if your app can be installed as a PWA:

1. Make sure you have:
   - A valid manifest.json file
   - A registered service worker
   - The app is served over HTTPS
   - At least one 192x192px icon

2. In Chrome, you should see an install icon in the address bar
3. Click it to install the app as a PWA
4. The app should now appear in your app list/start menu

If the install button doesn't appear, check Chrome DevTools > Application > Manifest to see if there are any issues with your manifest file.
