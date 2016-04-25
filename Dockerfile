FROM node:latest
MAINTAINER Christian Su
RUN apt-get update && apt-get upgrade -y && \
    apt-get install git && \
    mkdir /src && cd /src && \
    git clone https://github.com/christouuu/docker-sample.git && \
    cd docker-sample/nodejs-customerressources-addin && \
    npm install
WORKDIR /src/docker-sample/nodejs-customerressources-addin
EXPOSE 80
ENTRYPOINT npm start
