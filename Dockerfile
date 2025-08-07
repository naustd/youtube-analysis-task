FROM node:18-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    ffmpeg

# Install puppeteer dependencies
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./
RUN npm install --production

COPY . .

# Create directories for file storage
RUN mkdir -p /app/public/uploads/screenshots \
    && mkdir -p /app/public/uploads/audio \
    && mkdir -p /app/public/uploads/transcripts

ENV PORT=8080
EXPOSE 8080

CMD ["npm", "start"]