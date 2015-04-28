server {
        listen   80;
        server_name yiptv.com;       # Make site accessible from http://yiptv.com/
        return 301 https://yiptv.com$request_uri;
}

# HTTPS server
server {
    listen              443 ssl;
    server_name         yiptv.com;
    keepalive_timeout   70;

    # SSL configuration
    ssl_certificate             /etc/nginx/ssl/yiptv_com_bundle.crt;
    ssl_certificate_key         /etc/nginx/ssl/yiptv_com.key;
    ssl_verify_depth            3;
    ssl_protocols               SSLv2 SSLv3 TLSv1;
    ssl_ciphers                 HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers   on;
    ssl_session_cache           shared:SSL:10m;
    ssl_session_timeout         10m;

    root /devops/yiptv/client;
    index index.html;

    location / {
            # First attempt to serve request as file, then
            # as directory, then fall back to displaying a 404.
            try_files $uri $uri/ /index.html;
    }

    # Normal HTTP configuration
    # Reverse-proxy API calls to node
    location  /api/ {
        proxy_pass          http://localhost:3000;
        proxy_redirect      off;
        proxy_buffering     off;
        proxy_set_header    Host $host;
        proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header    X-Forwarded-Proto https;
    }
}