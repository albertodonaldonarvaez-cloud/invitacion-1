# Lightweight nginx to serve static files
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Custom nginx config for SPA
COPY nginx.conf /etc/nginx/conf.d/

# Copy project files
COPY index.html /usr/share/nginx/html/
COPY print.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY te-quiero.mp3 /usr/share/nginx/html/
COPY img/ /usr/share/nginx/html/img/

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
