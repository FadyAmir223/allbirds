FROM node:18.18.2-alpine

WORKDIR /app

COPY package.json .
RUN npm install --only=production && npm cache clean --force

COPY --chown=node:node . .
USER node

EXPOSE 3000
CMD ["node", "./dist/server.js"]
