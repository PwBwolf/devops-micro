server {
        listen   80;
        #listen   [::]:80 default_server ipv6only=on; ## listen for ipv6
        server_name yiptv.com;       # Make site accessible from http://yiptv.com/
        return 301 https://yiptv.com$request_uri;
}

server {
        listen              443;
        server_name         yiptv.com;
        keepalive_timeout   70;

        # Change the next line to point to the project path
        root /home/varun/projects/y/YipTV/build/dist;   # UPDATE PATH
        index index.html;

        # TLS
        ssl                         on;
        ssl_certificate             /home/varun/projects/y/YipTV/build/config/yiptv.crt;  # UPDATE PATH
        ssl_certificate_key         /home/varun/projects/y/YipTV/build/config/yiptv.key;  # UPDATE PATH
        ssl_verify_depth            3;
        ssl_session_timeout         5m;
        ssl_protocols               SSLv2 SSLv3 TLSv1;
        ssl_ciphers                 HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers   on;

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
