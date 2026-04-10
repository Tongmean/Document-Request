module.exports = {
    apps: [
      // Backend Configuration
      {
        name: "frontend-disc", // Name of the backend process
        script: "server.js", // Path to the main file of your Express.js backend
        watch: true, // Restarts when files in the backend directory change
        autorestart: true, // Ensures the app restarts on crash
        max_memory_restart: "1000M", // Restarts the app if memory exceeds 1000MB
        env: {
          NODE_ENV: "production", // Sets environment variable to production
          PORT: 3001, // Backend server listens on port 5000
        },
      },
    ]
}