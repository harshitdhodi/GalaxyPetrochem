self.addEventListener('push', async function(event) {
  if (event.data) {
    const data = event.data.json();

    // Don't show notification for subscription checks
    if (data.type === 'check') {
      return;
    }

    const title = data.title || 'New Message';
    const options = {
      body: data.message,
      icon: '/notification-icon.png',
      badge: '/notification-badge.png',
      data: data // Pass through any additional data
    };

    event.waitUntil(showNotification(title, options));
  }
});

async function showNotification(title, options) {
  await self.registration.showNotification(title, options);
}