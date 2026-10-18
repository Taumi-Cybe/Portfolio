<<<<<<< HEAD
docker run -d -p 80:80 -v "$PWD/index.html:/usr/local/apache2/htdocs/index.html" httpd
=======
docker run -d --name webber -v "$PWD/index.html":/usr/local/apache2/htdocs/index.html -p 80:80 httpd
>>>>>>> master
