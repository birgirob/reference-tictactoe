FROM node
WORKDIR /code
COPY ./build .
#RUN npm install -g nodemon
#RUN npm install -g create-react-app
COPY package.json .
COPY migrations.sh .
RUN chmod u+x ./migrations.sh
RUN npm install --silent
ENV NODE_PATH=.
EXPOSE 8080 3000
