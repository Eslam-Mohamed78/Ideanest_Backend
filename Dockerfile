FROM node:20 as base
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build


FROM base as production
EXPOSE ${PORT}
CMD ["npm", "run", "start:prod" ]