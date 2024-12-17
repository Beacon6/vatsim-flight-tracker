set dotenv-load := true

list:
  just -l

build:
  docker build -t beacon6/vatsim-flight-tracker:latest --build-arg VITE_SERVER=${VITE_SERVER} .

run:
  docker run -p ${PORT}:${PORT} -v ./db:/app/db --env-file ./.env beacon6/vatsim-flight-tracker:latest
