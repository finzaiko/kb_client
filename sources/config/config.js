export const BACKEND_URL = process.env.ENDPOINT || "http://localhost/kanboard";
export const API_URL = `${BACKEND_URL}/jsonrpc.php`;
export const CODE_PREFIX = `zkanboard_`;

export const COOKIE_NAME = CODE_PREFIX + "token";

export const AUTH_USER = CODE_PREFIX + "auth";
