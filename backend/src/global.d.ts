declare var process: {
  env: {
    NODE_ENV?: string;
    PORT?: string;
    JWT_SECRET?: string;
  };
};

declare var console: {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
};

declare var setInterval: (handler: () => void, timeout: number) => NodeJS.Timeout;
declare var setTimeout: (handler: () => void, timeout: number) => NodeJS.Timeout;
