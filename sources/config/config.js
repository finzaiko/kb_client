// export const BACKEND_URL = process.env.ENDPOINT || "http://localhost/kanboard";
// export const BACKEND_URL = process.env.ENDPOINT || "http://10.109.129.75/kanboard";
export const BACKEND_URL = process.env.ENDPOINT || "http://192.168.1.40/kanboard";
export const API_URL = `${BACKEND_URL}/jsonrpc.php`;
export const CODE_PREFIX = `zkanboard_`;

export const COOKIE_NAME = CODE_PREFIX + "token";

export const AUTH_USER = CODE_PREFIX + "auth";


