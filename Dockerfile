FROM node
WORKDIR /code
# Copy files needed
COPY ./build .
COPY package.json .
COPY migrations.sh .
# Change permission on script so docker can run it
RUN chmod u+x ./migrations.sh
# Install node modules
RUN npm install --silent
# Set node path environment variable
ENV NODE_PATH=.
# Expose ports
EXPOSE 8080 3000
