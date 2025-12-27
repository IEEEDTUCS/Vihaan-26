import { precacheAndRoute } from 'workbox-precaching'

// ✅ Handle precaching by Workbox
precacheAndRoute(self.__WB_MANIFEST)

// ✅ Push event listener
self.addEventListener('push', event => {
  let data = {};
  let rawDataText = '';

  try {
    rawDataText = event.data.text();
  } catch (e) {
    console.error('Failed to read push data as text:', e);
    rawDataText = 'Could not read push data.';
  }

  try {
    data = JSON.parse(rawDataText);
  } catch (e) {
    console.warn(
      'Push data was not valid JSON, using raw text instead:',
      rawDataText
    );
    data = {
      title: 'VIHAAN 9.0',
      message: rawDataText,
      icon: '/pwa-512x512.png',
      url: 'https://vihaan.ieeedtu.in/' // ✅ updated default URL
    };
  }

  const title = data.title || 'VIHAAN 9.0 Update';

  const options = {
    body: data.message || 'New update available!',
    icon: data.icon || '/pwa-512x512.png',
    badge: '/logoIcon.svg',
    data: {
      url: data.url || 'https://vihaan.ieeedtu.in/' // ✅ updated default URL
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// ✅ Handle notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl =
    event.notification.data?.url || 'https://vihaan.ieeedtu.in/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(
      windowClients => {
        // If the app is already open, focus it
        for (const client of windowClients) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }

        // Otherwise, open a new tab
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      }
    )
  );
});
