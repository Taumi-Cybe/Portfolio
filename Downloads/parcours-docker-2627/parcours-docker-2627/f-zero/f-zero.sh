docker buildx create --name captain-falcon
docker buildx use captain-falcon
docker buildx build --platform linux/amd64,linux/arm64 -t blue-falcon .
