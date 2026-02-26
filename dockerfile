from node:19.9-alpine3.14
WORKDIR /app
COPY package.json ./
RUN npm i
copy . .
EXPOSE 3000
CMD ["npm", "server.js"]