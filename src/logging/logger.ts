enum LogLevel { DEBUG = 'DEBUG', SILENT = 'SILENT' }

const logLevel = LogLevel.DEBUG

function sendRequest(type: string, args: any[]) {
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

export function log(...args: any[]) {
  sendRequest(logLevel, args)
}

export function warn(...args: any[]) {
  sendRequest(`${logLevel}|WARN`, args)
}

export function err(...args: any[]) {
  sendRequest(`${logLevel}|ERROR`, args)
}
