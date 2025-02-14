set dotenv-load := true

list:
  just -l

build:
  docker build -t beacon6/vatsim-flight-tracker:latest --build-arg VITE_SERVER=${VITE_SERVER} .

run:
  docker run -p ${PORT}:${PORT} -v ${DATABASE_PATH}:/app/${DATABASE_PATH} \
    --env-file ./.env beacon6/vatsim-flight-tracker:latest
