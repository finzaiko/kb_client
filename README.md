# ZBoard - Kanboard Frontend

[Kanboard](https://kanboard.org/) frontend UI powered by Webix


### API Modification

#### 1. Allow cross origin

Replace `<rootpath>/jsonrpc.php` to this:

```php
require __DIR__.'/app/common.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: ACCEPT, ORIGIN, X-REQUESTED-WITH, CONTENT-TYPE, AUTHORIZATION');
if ("OPTIONS" === $_SERVER['REQUEST_METHOD']) {
    die();
}

echo $container['api']->execute();
```

#### 2. Update get project query

```
?
```