const winston = require('winston')
const { combine, timestamp, label, printf } = winston.format;
const stackTrace = require('stack-trace')

function getCallerFunctionDetails(){
  // try {
  //   throw Error('')
  // } catch(err) {
  //   var caller_line = err.stack.split("\n")[1];
  //   var functionIndexStart = caller_line.indexOf("at ");
  //   var functionIndexEnd = caller_line.indexOf(" (");
  //   var pathIndexStart = caller_line.indexOf("/home/rohan/Projects/personal/nse-data-api");
  //   var clean = caller_line.slice(index+2, caller_line.length);
  //   return clean
  // }
  // let trace = stackTrace.get()
  // let traceLevel = 9
  // let callSite = trace[traceLevel]
  return 'File Function:Line';
  // return callSite.getFileName() + ' ' + callSite.getMethodName() + ':' + callSite.getLineNumber();
}

const myFormat = printf(info => {
  return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: getCallerFunctionDetails() }),
    timestamp(),
    myFormat
  ),
  transports: [
    new winston.transports.File({ filename: 'application.log', level: 'info' })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console());
}

module.exports = logger
