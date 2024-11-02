FROM node:18-alpine as back_end
WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/back_end

RUN npm install

FROM back_end as front_end
WORKDIR /usr/src/app/front_end

# Set the ARG for React app
ARG REACT_APP_BASE_URL
ARG REACT_APP_AUTH_URL
ARG REACT_APP_API_URL
ARG REACT_APP_BITCOIN_NETWORK
ARG REACT_APP_BTCPAY_BASE_URL

RUN npm ci --no-audit
RUN npm run build && rm -rf node_modules

FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=back_end /usr/src/app/back_end ./back_end
COPY --from=front_end /usr/src/app/front_end/build ./front_end/build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3000

CMD ["node", "/usr/src/app/back_end/index.js"]