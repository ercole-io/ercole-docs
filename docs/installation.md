# Installation
## Requirements
|     Component     | Prerequisite                                                                                 |
|:-----------------:|----------------------------------------------------------------------------------------------|
| Operating system  | CentOS, RedHat, OracleLinux 7/8                                                              |
| RAM               | 4GB                                                                                          |
| Filesystem        | 50GB (minimum)                                                                               |
| CPU               | 2 VirtualCPU                                                                                 |
| Database          | [MongoDB](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-red-hat/) >= 4.2.0     |

## Minimal default required network/firewall rules
|          From          |   To  | Port | Proto |
|:----------------------:|-------|------|-------|
| users                  | nginx | 80   | HTTPS |
| agents                 | nginx | 80   | HTTPS |
| users                  | nginx | 443  | HTTPS |
| agents                 | nginx | 443  | HTTPS |

It's highly recommended to also add [network/firewall rules for downloading artifacts from github.com](#suggested-network-firewall-rules).

## Instructions
This installation guide is for RHEL8, but the steps can be easily adapted for RHEL7 .

Add yum repositories with ercole RPMs
* `curl https://repository.ercole.io/shared/ercole-rhel8-x86_64.repo | tee /etc/yum.repos.d/ercole-x86_64.repo`
* `curl https://repository.ercole.io/shared/ercole-rhel8-noarch.repo | tee /etc/yum.repos.d/ercole-noarch.repo`
Install the required packages
* `yum install ercole ercole-web nginx`
* Configure nginx:
  * Increase `client_max_body_size` if agents receive 413 "Payload Too Large" responses from the server
  
* Load modular configuration files from the `/etc/nginx/conf.d`:
  * Store configuration file in the `/etc/nginx/conf.d` and use include directive in the main `nginx.conf` file to reference the content.
    ```
    include /etc/nginx/conf.d/*.conf;
    ```
  * Here is an example server block in `/etc/nginx/conf.d/ercole.conf` :
    ```
    # Redirect http to https
    server {  
        return 301 https://$host$request_uri;
    }

    # If you don't want to redirect http to https, delete the above server section and uncomment this:
    # server {
    #     listen       80 default_server;
    #     listen       [::]:80 default_server;
    #     root         /usr/share/ercole/web;
  
    #     location / {
    #             try_files $uri $uri/ /index.html =404;
    #     }
  
    #     location /data/ {
    #         proxy_pass http://127.0.0.1:11111/;
    #     }
  
    #     location /api/ {
    #         proxy_pass http://127.0.0.1:11113/;
    #     }
  
    #     location /repo/ {
    #         proxy_pass http://127.0.0.1:11114/;
    #     }
  
    #     location /chart/ {
    #         proxy_pass http://127.0.0.1:11116/;
    #     }
    # }
  
    # Settings for a TLS enabled server.
    #
    server {
    listen       443 ssl http2 default_server;
    listen       [::]:443 ssl http2 default_server;
  
          ssl_certificate "/etc/pki/nginx/server.crt";
          ssl_certificate_key "/etc/pki/nginx/private/server.key";
          ssl_session_cache shared:SSL:1m;
          ssl_session_timeout  10m;
          ssl_prefer_server_ciphers on;
  
          root         /usr/share/ercole/web;
  
          location / {
            try_files $uri $uri/ /index.html =404;
          }
  
          location /data/ {
              proxy_pass http://127.0.0.1:11111/;
          }
  
          location /api/ {
              proxy_pass http://127.0.0.1:11113/;
          }
  
          location /repo/ {
              proxy_pass http://127.0.0.1:11114/;
          }
  
          location /chart/ {
              proxy_pass http://127.0.0.1:11116/;
          }
    }
    ```
    * As default, we have set the redirect of `http` requests to `https`. Uncomment the appropriate section if needed.

* `mkdir -p /etc/pki/nginx/private`
* `openssl req -nodes -x509 -newkey rsa:4096 -keyout /etc/pki/nginx/private/server.key -out /etc/pki/nginx/server.crt`.
* Add the following lines to /etc/ercole/conf.d/20-ercolesetup.toml:
```
# FE.APIService.RemoteEndpoint = "https://<myip>/api"
# FE.ChartService.RemoteEndpoint = "https://<myip>/chart"
```
* If your machine has multiple IP addresses, check and fix endpoints in `/etc/ercole/conf.d/20-ercolesetup.toml`.
* If you want change the URI used to connect to mongodb, run the command `echo 'Mongodb.URI = "mongodb://user:pass@ip:port/ercole"' > /etc/ercole/conf.d/40-mongoconf.toml` with the right [Mongo URI](https://docs.mongodb.com/manual/reference/connection-string/).
* Review ercole configuration with `ercole show-config`
* If you have changed ercole configuration, run the command `ercole-setup`
* `systemctl start ercole`
* `systemctl enable nginx` 
* `systemctl start nginx`

### Troubleshooting

#### Failed (13: Permission denied) while connecting to upstream in /var/log/nginx/error.log
If curl https://127.0.0.1/repo/ping.txt doesn't return PONG! but returns nginx's 404 page and `/var/log/nginx/error.log` contains lines like
```
2020/08/03 09:25:01 [crit] 77642#0: *16 connect() to 127.0.0.1:11111 failed (13: Permission denied) while connecting to upstream, client: 127.0.0.1, server: _, request: "GET /data/ping HTTP/1.1", upstream: "http://127.0.0.1:11111/ping", host: "127.0.0.1"
``` 
Execute the command `setsebool -P httpd_can_network_connect 1`.
[https://stackoverflow.com/questions/23948527/13-permission-denied-while-connecting-to-upstreamnginx](https://stackoverflow.com/questions/23948527/13-permission-denied-while-connecting-to-upstreamnginx)
