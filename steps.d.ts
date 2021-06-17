/// <reference types='codeceptjs' />
type steps_file = typeof import('./xui/steps.js');

declare namespace CodeceptJS {
  interface SupportObject { I: I, current: any }
  interface Methods extends Puppeteer {}
  interface I extends ReturnType<steps_file> {}
  namespace Translation {
    interface Actions {}
  }
}
