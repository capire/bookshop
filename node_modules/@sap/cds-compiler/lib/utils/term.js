//
// This file is used for color output to stderr and stdout.
// Use `term.error`, `term.warn` and `term.info` as they use color output
// per default if the process runs in a TTY, i.e. stdout as well as
// stderr are TTYs. stderr/stdout are no TTYs if they (for example)
// are piped to another process or written to file:
//
//    node myApp.js              # stdout.isTTY: true,      stderr.isTTY: true
//    node myApp.js | cat        # stdout.isTTY: undefined, stderr.isTTY: true
//    node myApp.js |& cat       # stdout.isTTY: undefined, stderr.isTTY: undefined
//    node myApp.js > out.txt    # stdout.isTTY: undefined, stderr.isTTY: true
//    node myApp.js 2> out.txt   # stdout.isTTY: true,      stderr.isTTY: undefined
//

'use strict';

const stderrHasColor = process.stderr.isTTY;
const stdoutHasColor = process.stdout.isTTY;

let hasColor = stdoutHasColor && stderrHasColor;

module.exports.useColor = (mode) => {
  switch (mode) {
    case false:
    case 'never':
      hasColor = false;
      break;
    case true:
    case 'always':
      hasColor = true;
      break;
    default:
      hasColor = stdoutHasColor && stderrHasColor;
      break;
  }
};

// https://docs.microsoft.com/en-us/windows/console/console-virtual-terminal-sequences
const t = {
  reset: '\x1b[0m', // Default
  bold: '\x1b[1m', // Bold/Bright
  underline: '\x1b[4m', // for links
  red: '\x1b[31m', // Foreground Red
  green: '\x1b[32m', // Foreground Green
  yellow: '\x1b[33m', // Foreground Yellow
  magenta: '\x1b[35m', // Foreground Magenta
  cyan: '\x1b[36m', // Foreground Cyan
};

const as = (codes, o) => (hasColor ? (codes + o + t.reset) : (`${ o }`));

const asError = o => as(t.red + t.bold, o);
const asWarning = o => as(t.yellow, o);
const asInfo = o => as(t.green, o);
const asHelp = o => as(t.cyan, o);
module.exports.underline = o => as(t.underline, o);
module.exports.bold = o => as(t.bold, o);

module.exports.asSeverity = (severity, msg) => {
  switch ((`${ severity }`).toLowerCase()) {
    case 'error': return asError(msg);
    case 'warning': return asWarning(msg);
    case 'info': return asInfo(msg);
    case 'help': return asHelp(msg);
    // or e.g. 'none'
    default: return msg;
  }
};

module.exports.codes = t;
module.exports.as = as;
module.exports.error = asError;
module.exports.warn = asWarning;
module.exports.info = asInfo;
module.exports.help = asHelp;
