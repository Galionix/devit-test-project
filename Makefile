all: nx-serve

nx-serve:
	npm run start-app
# frontend:
# 	npm run start-frontend
# backend:
# 	npm run start-backend

docker:
	docker-compose up

dev: docker nx-serve

build:
	npm run build