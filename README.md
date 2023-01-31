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

#### 2. Update get task query

getAll method in `kanboard/app/Model/TaskFinderModel.php`
to this to get all available joined data
```php
public function getAll($project_id, $status_id = TaskModel::STATUS_OPEN)
{
    return
        $this->getExtendedQuery()
        ->eq(TaskModel::TABLE.'.project_id', $project_id)
        ->eq(TaskModel::TABLE.'.is_active', $status_id)
        ->desc(TaskModel::TABLE.'.id') // order last update on top
        ->findAll();
}
```

#### 3. Update get task by id query

getAll method in `kanboard/app/Model/TaskFinderModel.php`
to this to get by id available joined data
```php
public function getById($task_id)
{
    return  $this->getExtendedQuery()->eq(TaskModel::TABLE.'.id', $task_id)->findOne();
}
```