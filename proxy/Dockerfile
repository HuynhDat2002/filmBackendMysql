FROM nginx:latest

RUN rm /etc/nginx/nginx.conf


# Update package lists and install openssl
RUN apt-get update && apt-get install -y openssl

# Generate the self-signed certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/certs/selfsigned.key \
    -out /etc/ssl/certs/selfsigned.crt \
    -subj "/C=US/ST=State/L=City/O=Organization/OU=Unit/CN=localhost"


COPY nginx.conf /etc/nginx/nginx.conf
