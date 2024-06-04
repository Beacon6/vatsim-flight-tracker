build:
	docker build -t beacon6/vatsim-flight-tracker .

run:
	docker run -p 5000:5000 beacon6/vatsim-flight-tracker:latest
