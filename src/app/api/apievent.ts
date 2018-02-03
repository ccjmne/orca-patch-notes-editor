export enum Level {
  DEBUG = 'debug',
  INFO = 'info',
  ERROR = 'error'
}

export class ApiEvent {

  constructor(readonly message: string, readonly level: Level = Level.INFO) { }

  static fromHTTPResponse(response: any): ApiEvent {
    if (response.error) {
      return new ApiEvent(response.error.message, Level.ERROR);
    }

    return new ApiEvent(response.body);
  }
}

export class DebugApiEvent extends ApiEvent {

  constructor(message: string);
  constructor(source: ApiEvent);
  constructor(source: string | ApiEvent) {
    super(source instanceof ApiEvent ? source.message : source, Level.DEBUG);
  }
}
