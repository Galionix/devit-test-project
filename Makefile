all: nx-serve

nx-serve:
	npm run start-app

docker:
	docker-compose up

# frontend:
# 	nx run frontend:serve:development --port=3000