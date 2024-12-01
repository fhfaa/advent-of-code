export enum LogType {
  Success, Failure, Error
};


export default class Logger {
  private static readonly START: { [key in LogType]: string } = {
    [LogType.Success]: '\x1b[1;32m✔️ ',
    [LogType.Failure]: '\x1b[1;31m❌ ',
    [LogType.Error]: '\x1b[1;31m☠️ ',
  }
  static readonly END = '\x1b[0m'

  static wrap(start: LogType, args: any[]): any[] {
    if (typeof args[0] === 'string') {
      args[0] = `${Logger.START[start]}${args[0]}`;
    } else {
      args.unshift(start);
    }

    if (typeof args.at(1) === 'string') {
      args[args.length - 1] = `${args.at(-1)}${Logger.END}`;
    } else {
      args.push(Logger.END);
    }
    return args;
  }

  static wrapString(type: LogType, msg: string): string {
    return `${Logger.START[type]}${msg}${Logger.END}`
  }

  static success(...args: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.log(...Logger.wrap(LogType.Success, args));
  }

  static failure(...args: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.log(...Logger.wrap(LogType.Failure, args));
  }

  static error(...args: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console.log(...Logger.wrap(LogType.Error, args));
  }
}