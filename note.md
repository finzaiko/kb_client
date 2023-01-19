npm run buildconf --endpoint=http://abc.com

docker build -t zboard:0.1 .

docker run --rm --name zboard-1 -p 9092:80 -d zboard:0.1

docker exec -it <container-id> sh