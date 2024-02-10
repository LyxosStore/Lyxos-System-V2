const process = require('node:process');

process.on('unhandledRejection', async(reason, promise) => {
    console.log('Unhandled Rejection at: ', promise, 'reason: ', reason);
});

process.on('uncaughtException', (err) => {
    console.log('Uncaught Execption: ', err);
});

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Uncaught Exception Monitor: ', err, origin);
});