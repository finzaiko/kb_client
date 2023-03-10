build-docker:
	docker build -t finzaiko/kb_client:1.0 .

run-docker:
	docker run --rm --name kbclient -p 8085:80 -d -e "API_SERVER=http://localhost/kanboard" finzaiko/kb_client:1.0

push-docker-hub:
	docker push finzaiko/kb_client:1.0

install:
	npm i