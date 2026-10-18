ARG VERSION=1.19-rc-alpine
FROM golang:$VERSION
ENV DIRECTORY=/webserver
ENV PORT=2022
RUN apk add --no-cache curl
RUN mkdir $DIRECTORY
WORKDIR $DIRECTORY
COPY index.html $DIRECTORY
RUN wget https://raw.githubusercontent.com/Deytron/files/main/big-boss/main.go
RUN go mod init webserver
RUN go get -u github.com/gin-gonic/gin
LABEL version='1.0'
LABEL description='A simple test of the Gin go framework'
EXPOSE 2022
HEALTHCHECK --interval=30s --retries=3 --timeout=30s CMD curl -f http://localhost:2022 || exit 1
CMD go run main.go
