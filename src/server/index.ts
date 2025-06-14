import {
  onOpen,
  openPlugin,
} from './ui';

import {
  fillE2FieldWith
} from "./custom"

// Public functions must be exported as named exports
// Если здесь не будет экспорта, то будет писать к примеру "Script function not found: onOpen"
// То есть функция просто не попадёт в code.gs файл в AppsScript
export {
  onOpen,
  openPlugin,
  fillE2FieldWith
};
