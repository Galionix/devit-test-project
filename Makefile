all: nx-serve

nx-serve:
	npm run start-app

backend:
	npm run start

# to build frontend backend must be running
build:
	npm run build-app