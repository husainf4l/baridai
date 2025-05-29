module.exports = {
    apps: [
        {
            name: 'baridai',
            script: 'npm',
            args: 'start',
            cwd: '/home/husain/baridai/baridai',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'production',
                PORT: 3003
            }
        }
    ]
};
