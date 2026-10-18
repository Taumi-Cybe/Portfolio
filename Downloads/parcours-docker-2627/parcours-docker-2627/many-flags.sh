<<<<<<< HEAD
docker run -dt --name mushroom-kingdom --memory 500m --network none --read-only --cpus 2 --env=BROTHER=luigi --hostname mario -w /srv node
=======
docker run -d -t --name mushroom-kingdom --memory 500m --cpus 2 --network none --read-only --env=BROTHER=luigi --hostname mario --workdir /srv node
>>>>>>> master
