FROM nikolaik/python-nodejs:python3.12-nodejs20

WORKDIR /app

COPY package*.json .
COPY requirements.txt .

RUN npm install
RUN pip install -r /app/requirements.txt

COPY . .

RUN npm run build
RUN npm install -g serve
RUN pip install gunicorn

CMD serve -s dist & gunicorn -w 2 -b :5000 api:app
EXPOSE 3000
EXPOSE 5000
