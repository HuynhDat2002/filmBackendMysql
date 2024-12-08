# FROM nginx:latest
FROM nginx:latest

RUN rm /etc/nginx/nginx.conf

# Update package lists and install openssl
RUN apt-get update && apt-get install -y openssl

# Generate the self-signed certificate
COPY ./cert/selfsigned.crt /etc/ssl/certs/selfsigned.crt;
COPY ./cert/selfsigned.key /etc/ssl/certs/selfsigned.key;



USER root

# # Install ModSecurity (build from source)
# RUN git clone https://github.com/SpiderLabs/ModSecurity.git /opt/ModSecurity \
#     && cd /opt/ModSecurity \
#     && git submodule init \
#     && git submodule update \
#     && ./build.sh \
#     && ./configure \
#     && make \
#     && make install

# # Download and install the NGINX ModSecurity module
# RUN wget https://github.com/SpiderLabs/ModSecurity-nginx/archive/master.tar.gz -O /opt/modsec-nginx.tar.gz \
#     && tar -zxvf /opt/modsec-nginx.tar.gz -C /opt/ \
#     && cd /opt/ModSecurity-nginx-master \
#     && ./configure --with-compat --add-dynamic-module=/opt/ModSecurity/nginx \
#     && make modules \
#     && cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules/
# Install necessary build dependencies for ModSecurity
# RUN apt-get update && \
#     apt-get install -y apt-utils autoconf automake build-essential \
#     git libcurl4-openssl-dev libgeoip-dev liblmdb-dev libpcre++-dev \
#     libtool libxml2-dev libyajl-dev pkgconf wget zlib1g-dev
RUN apt-get update && apt-get install -y apt-utils autoconf automake build-essential \
    git libcurl4-openssl-dev libgeoip-dev liblmdb-dev libpcre3-dev \
    libtool libxml2-dev libyajl-dev pkgconf wget zlib1g-dev
# Clone the ModSecurity repository
RUN git clone --depth 1 -b v3/master --single-branch https://github.com/SpiderLabs/ModSecurity \
    && cd ModSecurity \
    && git submodule init \
    && git submodule update \
    && ./build.sh \
    && ./configure \
    && make \
    && make install \
    && cd ..

# Clone the ModSecurity-nginx connector repository
RUN git clone --depth 1 https://github.com/SpiderLabs/ModSecurity-nginx.git 

# Download and extract NGINX 1.13.1
RUN wget http://nginx.org/download/nginx-1.27.3.tar.gz \
    && tar zxvf nginx-1.27.3.tar.gz \
    && rm nginx-1.27.3.tar.gz \
    && cd nginx-1.27.3 \
    && ./configure --with-compat --add-dynamic-module=../ModSecurity-nginx \
    && make modules \
    && cp objs/ngx_http_modsecurity_module.so /etc/nginx/modules \
    && cd ..
 
RUN apt-get update && apt-get install -y wget && apt-get clean

# Create the /etc/nginx/modsec directory
RUN mkdir -p /etc/nginx/modsec

# # Tải file modsecurity.conf-recommended vào thư mục /etc/nginx/modsec
# RUN wget -P /etc/nginx/modsec/ https://raw.githubusercontent.com/SpiderLabs/ModSecurity/v3/master/modsecurity.conf-recommended

# # Đổi tên file modsecurity.conf-recommended thành modsecurity.conf
# RUN mv /etc/nginx/modsec/modsecurity.conf-recommended /etc/nginx/modsec/modsecurity.conf

# Sao chép file unicode.mapping vào thư mục /etc/nginx/modsec
RUN cp ModSecurity/unicode.mapping /etc/nginx/modsec

# RUN sed -i 's/SecRuleEngine DetectionOnly/SecRuleEngine On/' /etc/nginx/modsec/modsecurity.conf

COPY ./modsecurity.conf /etc/nginx/modsec/modsecurity.conf

COPY nginx.conf /etc/nginx/nginx.conf

USER root
# Cài đặt các công cụ cần thiết

# Tải xuống và giải nén OWASP ModSecurity CRS
RUN wget https://github.com/SpiderLabs/owasp-modsecurity-crs/archive/v3.0.2.tar.gz && \
tar -xzvf v3.0.2.tar.gz && \
mv owasp-modsecurity-crs-3.0.2 /etc/nginx

RUN chmod 777 /etc/nginx/owasp-modsecurity-crs-3.0.2
RUN rm /etc/nginx/owasp-modsecurity-crs-3.0.2/crs-setup.conf
COPY crs-setup.conf /etc/nginx/owasp-modsecurity-crs-3.0.2/crs-setup.conf
# # Sao chép và thiết lập cấu hình CRS
# RUN cd /etc/nginx/owasp-modsecurity-crs-3.0.2 && \
# cp crs-setup.conf.example crs-setup.conf
COPY ./modsec/main.conf /etc/nginx/modsec/main.conf
COPY ./.htpasswd /etc/nginx/.htpasswd

# Đảm bảo rằng chứng chỉ SSL tồn tại và có quyền truy cập đúng
RUN chmod 777 /etc/ssl/certs/selfsigned.crt
RUN chmod 777 /etc/ssl/certs/selfsigned.key

# # Cấu hình lại Nginx để sử dụng SSL
# RUN sed -i 's|ssl_certificate .*|ssl_certificate /etc/ssl/certs/selfsigned.crt;|' /etc/nginx/nginx.conf
# RUN sed -i 's|ssl_certificate_key .*|ssl_certificate_key /etc/ssl/private/selfsigned.key;|' /etc/nginx/nginx.conf