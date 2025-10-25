# Use an official Node.js runtime as a parent image.
# Using a specific Long-Term Support (LTS) version is a best practice for stability.
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker's layer caching.
# The `npm install` step will only be re-run if these files change.
COPY package.json package-lock.json* ./

# Install production dependencies. The --production flag avoids installing devDependencies.
RUN npm install --production

# Copy the rest of your application's source code from your host to your image filesystem.
COPY . .

# Your application in index.js listens on process.env.PORT || 3000.
# Fly.io will set the PORT environment variable and expects your app to listen on it.
# This EXPOSE instruction is good practice for documentation.
EXPOSE 3000

# Define the command to run your app.
# This will be `node index.js`.
CMD ["node", "index.js"]