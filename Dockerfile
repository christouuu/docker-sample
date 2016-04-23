FROM node:latest
MAINTAINER Matthieu Klotz
RUN apt-get update && apt-get upgrade -y && \
    apt-get install git && \
    mkdir /src && cd /src && \
    git clone https://github.com/matthieuklotz/docker-sample.git && \
    cd docker-sample/nodeSample && \
    npm install
WORKDIR /src/docker-sample/nodeSample
EXPOSE 3000
ENTRYPOINT npm start
