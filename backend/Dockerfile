FROM php:8.2-apache

# Enable required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Copy backend files to container
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html

EXPOSE 80
