FROM php:8.2-apache

# Enable required PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Copy backend files to container
COPY . /var/www/html/

# Set working directory
WORKDIR /var/www/html

RUN sed -i 's/Listen 80/Listen 8080/g' /etc/apache2/ports.conf && \
    sed -i 's/<VirtualHost \*:80>/<VirtualHost \*:8080>/g' /etc/apache2/sites-available/*.conf

EXPOSE 8080

CMD ["apache2-foreground"]
