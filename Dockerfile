# Static site served by nginx, ready for Google Cloud Run.
# Cloud Run sends requests to the port named in $PORT (default 8080); the
# nginx:alpine base image substitutes env vars into files under
# /etc/nginx/templates/ at startup, so we template `listen ${PORT}`.
FROM nginx:1.27-alpine

# Default for local `docker run`; Cloud Run overrides this at deploy time.
ENV PORT=8080

# nginx config template — entrypoint renders it to /etc/nginx/conf.d/default.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Static assets
COPY index.html app.js /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/

EXPOSE 8080

# Base image's entrypoint runs envsubst on the template, then this CMD starts nginx.
CMD ["nginx", "-g", "daemon off;"]
