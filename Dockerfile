FROM node:16.17.0-bullseye-slim
WORKDIR /email_svc
COPY package.json /email_svc
RUN npm install
COPY . .
CMD node index.js
EXPOSE 8000
