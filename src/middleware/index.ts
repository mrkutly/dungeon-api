import {
  handleCors,
  handleBodyParsing,
  handleCookieParsing,
  handleCompression,
  logRequest,
} from "./common";

import { handleAPIDocs } from "./apiDocs";

export default [handleCors, handleBodyParsing, handleCookieParsing, handleCompression, handleAPIDocs, logRequest];