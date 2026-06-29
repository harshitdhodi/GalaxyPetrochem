module.exports = {
  apps: [
    {
      name: "GalaxyPetrochem",
      script: "index.js",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3036,
      },
    },
  ],
};
