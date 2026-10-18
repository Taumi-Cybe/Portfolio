docker service create --replicas 3 --name bee curlimages/curl curl www.ynov.com
docker service inspect --pretty bee
