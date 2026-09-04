FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --omit=dev
COPY . .

FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=base /usr/src/app .
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
USER node
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/healthz || exit 1
CMD ["node", "server.js"]
