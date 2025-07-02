# build images
docker compose -f docker-compose.yml build

# push images after built
docker compose -f docker-compsose.yml push

# run pull image development enviroment
docker compose -f docker-compose.dev.yml pull
# run development enviroment
docker compose -f docker-compose.dev.yml up

# run pull image production enviroment
docker compose -f docker-compose.prod.yml pull
# run production enviroment
docker compose -f docker-compose.prod.yml up

# clean dangling image
docker image prune

# clear all of docker
docker system prune -a --volumes -f