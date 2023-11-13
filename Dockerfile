# syntax=docker/dockerfile:1

FROM nikolaik/python-nodejs:python3.12-nodejs20
WORKDIR /app
COPY . .

RUN pip install -r /app/requirements.txt
RUN pip install gunicorn

RUN npm install
RUN npm run build
RUN npm install -g serve

CMD serve -s build & gunicorn -w 2 -b :5000 api:app
EXPOSE 3000
EXPOSE 5000
