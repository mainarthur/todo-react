enum LogLevel { DEBUG = 'DEBUG', SILENT = 'SILENT' }

class Console {
  logLevel: LogLevel;

  constructor(logLevel: LogLevel) {
    this.logLevel = logLevel;
  }

  log(...args: any[]) {
    fetch('http://logs.todolist.local/log', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        level: this.logLevel.toString(),
        log: args.length > 1 ? args.map((e) => JSON.stringify(e)).join(' ') : JSON.stringify(args[0]),
      }),
    });
  }
}

export default new Console(LogLevel.DEBUG);
