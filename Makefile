start: docker project

docker:
	docker-compose down
	docker-compose up

project:
	npm run start