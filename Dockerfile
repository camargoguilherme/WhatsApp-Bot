# syntax=docker/dockerfile:1
## Comando obrigatório
## Baixa a imagem do node com versão alpine (versão mais simplificada e leve)
# STAGE 1
FROM node:14.17.5-slim as builder
RUN mkdir -p /home/app/node_modules && chown -R node:node /home/app
WORKDIR /home/app
COPY package*.json ./
RUN npm config set unsafe-perm true
RUN npm install -g typescript
RUN npm install -g ts-node
USER node
RUN npm install --cached-folder
COPY --chown=node:node . .
RUN npm run build


# STAGE 2
FROM node:14.17.5-slim
# Install Chromium.
RUN apt-get update \
&& apt-get install -y wget gnupg \
&& wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
&& sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
&& apt-get update \
&& apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
  --no-install-recommends \
&& rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/app/node_modules && chown -R node:node /home/app

WORKDIR /home/app
COPY package*.json ./
USER node
# RUN npm install --save-dev sequelize-cli
RUN npm install --production --cached-folder
COPY --from=builder --chown=node:node /home/app/build ./build
#COPY --chown=node:node .env .
COPY --chown=node:node  /public ./public

## Não se repete no Dockerfile
## Executa o comando yarn start para iniciar o script que que está no package.json
CMD [ "node", "build/index.js" ]
