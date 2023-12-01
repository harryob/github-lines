FROM node:alpine

WORKDIR /home/discord_bot
COPY src/ /home/discord_bot/src/
COPY package.json /home/discord_bot/package.json
COPY package-lock.json /home/discord_bot/package-lock.json
COPY tsconfig.json /home/discord_bot/tsconfig.json
RUN npm install
RUN npm run build

CMD ["npm", "start"]