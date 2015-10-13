openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout privateKey.key -out certificate.crt;
openssl pkcs12 -export -out myCert.pfx -inkey privateKey.key -in certificate.crt