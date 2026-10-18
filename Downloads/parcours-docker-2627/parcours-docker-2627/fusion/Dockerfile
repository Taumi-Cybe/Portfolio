FROM node
RUN mkdir /fusion
WORKDIR /fusion
RUN npm init -y
RUN npm install express
COPY server.js /fusion/server.js
CMD node server.js
