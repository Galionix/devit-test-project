all: nx-serve

nx-serve:
	npm run start-app

docker:
	docker-compose up

dev: docker nx-serve