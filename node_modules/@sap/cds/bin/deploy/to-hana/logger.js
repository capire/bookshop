module.exports = {

    defaultLogger: {
        ...console,
        isTTY: () => {
            return process.stdout.isTTY;
        },
        write: (message, clearLine) => {
            if (clearLine && process.stdout.isTTY) {
                process.stdout.clearLine();  // clear the line
                process.stdout.cursorTo(0);  // move cursor to begin of line
            }
            process.stdout.write(message);
        }
    },

    nullLogger: {
        log: () => { },
        error: () => { },
        debug: () => { },
        warn: () => { },
        write: () => { },
        time: () => { },
        timeEnd: () => { },
        isTTY: () => { }
    }
}
