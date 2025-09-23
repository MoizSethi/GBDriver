FROM node:22-alpine

WORKDIR /app

# Copy package.json and lockfile first
COPY package*.json ./

# Install inside container (so native modules compile correctly)
RUN npm rebuild bcrypt --build-from-source 
RUN npm install --production

# Now copy the rest of the app
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
