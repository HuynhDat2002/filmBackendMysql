# FROM nginx:latest
FROM nginx:1.27.3-alpine

RUN rm /etc/nginx/nginx.conf

# RUN apt-get update && apt-get install -y openssl




# USER root
RUN chmod -R 755 /var/log/nginx && \
    chown -R root:root /var/log/nginx

# RUN apt-get update && apt-get install -y apt-utils autoconf automake build-essential \
#     git libcurl4-openssl-dev libgeoip-dev liblmdb-dev libpcre3-dev libpcre2-dev \
#     libtool libxml2-dev libyajl-dev pkgconf wget zlib1g-dev wget
# RUN apk add --no-cache \
#     autoconf automake build-base git curl-dev \
#     geoip-dev lmdb-dev pcre-dev pcre2-dev libtool \
#     libxml2-dev yajl-dev pkgconf wget zlib-dev linux-headers wget git
# Clone the ModSecurity repository
# RUN git clone --depth 1 -b v3/master --single-branch https://github.com/SpiderLabs/ModSecurity \
#     && cd ModSecurity \
#     && git submodule init \
#     && git submodule update \
#     && ./build.sh \
#     && ./configure \
#     && make \
#     && make install \
#     && cd ..

# # Clone the ModSecurity-nginx connector repository
# RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git 

# # Download and extract NGINX
# RUN wget http://nginx.org/download/nginx-1.27.3.tar.gz \
#     && tar zxvf nginx-1.27.3.tar.gz \
#     && rm nginx-1.27.3.tar.gz \
#     && cd nginx-1.27.3 \
#     && ./configure --with-compat --add-dynamic-module=../ModSecurity-nginx \
#     && make modules \
#     && cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules \
#     && cd ..
 
# RUN apt-get update && apt-get install -y wget && apt-get clean


# RUN mkdir -p /etc/nginx/modsec



# # Sao chép file unicode.mapping vào thư mục /etc/nginx/modsec
# RUN cp ModSecurity/unicode.mapping /etc/nginx/modsec

# # RUN sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/nginx/modsec/modsecurity.conf

# COPY ./modsecurity.conf /etc/nginx/modsec/modsecurity.conf

COPY nginx.conf /etc/nginx/nginx.conf

# USER root
# Cài đặt các công cụ cần thiết

# Tải xuống và giải nén OWASP ModSecurity CRS
# RUN wget https://github.com/SpiderLabs/owasp-modsecurity-crs/archive/v3.0.2.tar.gz && \
#     tar -xzvf v3.0.2.tar.gz && \
#     mv owasp-modsecurity-crs-3.0.2 /etc/nginx

# RUN chmod 777 /etc/nginx/owasp-modsecurity-crs-3.0.2
# COPY crs-setup.conf /etc/nginx/owasp-modsecurity-crs-3.0.2/crs-setup.conf


# COPY ./modsec/main.conf /etc/nginx/modsec/main.conf
COPY ./.htpasswd /etc/nginx/.htpasswd
