FROM node:15.3.0-alpine3.10

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["node", "src/bot.js"]