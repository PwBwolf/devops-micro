server {
        listen   80;
        server_name int.yiptv.net;       # Make site accessible from http://int.yiptv.net/
        # return 301 https://int.yiptv.com$request_uri;

        root /devops/yiptv/client;
        index index.html;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ /index.html;
        }

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
