#!/bin/sh
sed -i 's,API_BASE_URL, '"$API_SERVER"',g' '/usr/share/nginx/html/codebase/myapp.js'
nginx -g 'daemon off;'