FROM node:20-alpine

WORKDIR /app

COPY package.json* ./
RUN npm install --omit=dev 2>/dev/null || true

COPY . .

ENV PORT=3000
ENV SETTINGS_FILE=/data/settings.json
ENV UPLOAD_DIR=/data/img

EXPOSE 3000

CMD ["node", "server.js"]
