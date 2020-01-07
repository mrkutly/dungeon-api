/* eslint-disable @typescript-eslint/no-unused-vars */

type MockClient = {
  get: (key: string, cb: Function) => void;
  set: (key: string, data: string) => void;
};
export default {
  createClient(): MockClient {
    return {
      get(key: string, cb: Function): void {
        cb();
      },
      set(key: string, data: string): void { }
    };
  }
};