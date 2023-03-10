# Note

### Test build frontend
```
npm run buildconf --endpoint=http://abc.com
```

### Build sync capasitor
```
npx cap sync
```

### Build docker
```
docker build -t zboard:0.1 .
```
or with specific server url:
```
docker build -t zboard:0.1 --build-arg API_SERVER_ARG=http://localhost/kanboard .
```

### Run docker
```
docker run --rm --name zboard-1 -p 9092:80 -d zboard:0.1
```
or
```
docker run --rm --name zboard-1 -p 9091:80 -d -e "API_SERVER=http://localhost/kanboard" zboard:0.1
```

### Ssh to docker
```
docker exec -it <container-id> sh
```

### How to Stop All Docker Containers
```
docker kill $(docker ps -q)
```

### How to Remove All Docker Containers
```
docker rm $(docker ps -a -q)
```

### How To Remove All Docker Images
```
docker rmi $(docker images -q)
or
sudo docker rmi -f $(sudo docker images -a -q)




