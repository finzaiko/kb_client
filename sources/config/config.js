export const APP_NAME = process.env.APP_NAME;

// export const BACKEND_URL = process.env.ENDPOINT || "http://localhost/kanboard";
export const BACKEND_URL = process.env.ENDPOINT || "http://10.109.129.75/kanboard";
export const API_URL = `${BACKEND_URL}/jsonrpc.php`;
export const CODE_PREFIX = `kbc`;

export const COOKIE_NAME = CODE_PREFIX + "_token";

export const AUTH_USER = CODE_PREFIX + "_auth";
export const LAST_VISIT = CODE_PREFIX + "_lastvisit";
export const OFFLINE_DURATION = 1; // in hours

// IndexedDB DB and Store Properties
export const DB_NAME = CODE_PREFIX + `_idb`;
export const DB_VERSION = 1;
export const PROJECT_STORE_NAME = "project";
export const TASK_STORE_NAME = "task";
export const COMMENT_STORE_NAME = "comment";
