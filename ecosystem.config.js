module.exports = {
  apps: [
    {
      name: "pong-back",
      script: "./src/server.js",
      cwd: "./backend"
    },
    {
      name: "pong-front",
      script: "./frontend/server"
    }
  ]
};
