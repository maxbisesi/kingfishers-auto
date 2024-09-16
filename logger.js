var logLegend = `\t\t\t\t\t\t\t\t\t\tLEGEND
\t\t\t\t\t========================================= 
\t\t\t\t\t ( X=> ) REDUX ACTION NAME\n`;
var seperator = `--------------------------------------------------------------------------------------------------------------------------------------------\n`;
var testLog = `${logLegend}\n`;

export function logger(message,userSeperator) {
    testLog += (`\t${message}\n`);
    if(userSeperator) testLog += seperator
}

export function writeLog() {
    fs.writeFile(`testLog.json`,testLog);
} 