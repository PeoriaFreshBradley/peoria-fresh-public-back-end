FROM node:18 as development
 
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --only=development

COPY . .

RUN rm -rf dist/
RUN npm run build

FROM node:18 as production

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --only=production

COPY . .
COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/src/main.js" ]