enum LogLevel { DEBUG = 'DEBUG', SILENT = 'SILENT' }

class Console {
  logLevel: LogLevel

  constructor(logLevel: LogLevel) {
    this.logLevel = logLevel
  }

  static sendRequest(type: string, args: any[]) {
    fetch('http://logs.todolist.local/log', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        level: type,
        log: args.length > 1 ? args.map((e) => (e instanceof Error ? `${e.name}: ${e.message}\n${e.stack}` : JSON.stringify(e))).join(' ') : JSON.stringify(args[0]),
      }),
    })
  }

  log(...args: any[]) {
    Console.sendRequest(this.logLevel, args)
  }

  warn(...args: any[]) {
    Console.sendRequest(`${this.logLevel}|WARN`, args)
  }

  err(...args: any[]) {
    Console.sendRequest(`${this.logLevel}|ERROR`, args)
  }
}

export default new Console(LogLevel.DEBUG)
