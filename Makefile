build:
		docker build --build-arg BUILD_TYPE=dev -t beacon6/vatsim-flight-tracker:latest-dev .

build-prod:
		docker build -t beacon6/vatsim-flight-tracker:latest-prod .

run:
		docker run -p 5000:5000 beacon6/vatsim-flight-tracker:latest-dev

run-prod:
		docker run -p 5000:5000 beacon6/vatsim-flight-tracker:latest-prod
