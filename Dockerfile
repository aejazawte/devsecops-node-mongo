FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --production

# Copy backend code
COPY server.js .
COPY routes ./routes
COPY models ./models

# Copy dummy frontend build
COPY frontend/build ./public

EXPOSE 3000

CMD ["node", "server.js"]
