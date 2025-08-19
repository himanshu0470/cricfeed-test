self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
      body: data.message,
      icon: data.icon,
      image: data.image,
      data: { url: data.url },
      actions: [
        {
          action: 'open_url',
          title: 'Open URL'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  });
  