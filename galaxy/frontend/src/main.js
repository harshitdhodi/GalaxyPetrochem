// src/worker.js
self.onmessage = (e) => {
    const data = e.data;
    // Example: Heavy computation (replace with your actual logic)
    const result = data.map(item => item * 2); // Placeholder
    self.postMessage(result);
  };