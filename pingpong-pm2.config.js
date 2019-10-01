module.exports = {
    apps: [
        {
            name: "pong-back",
            cwd: "./backend",
            script: "npm",
            args: "run prod",
        },
        {
            name: "pong-front",
            script: "./frontend/server",
        },
    ],
};
