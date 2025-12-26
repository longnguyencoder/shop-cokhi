module.exports = {
    apps: [
        {
            name: 'shop-co-khi-api',
            script: 'venv/bin/gunicorn',
            args: '-w 4 -k uvicorn.workers.UvicornWorker app.main:app --bind 0.0.0.0:8000',
            cwd: '/var/www/shop-co-khi/server',
            interpreter: 'python3',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
