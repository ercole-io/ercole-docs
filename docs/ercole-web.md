# Ercole Web
Ercole-web is the official optional frontend of the ercole.io project

## Requirements

|     Component     | Prerequisite                                 |
|:-----------------:|----------------------------------------------|
| Operating system  | CentOS, RedHat, OracleLinux 7/8              |
| RAM               | 512MB                                        |
| Filesystem        | 2GB (minimum)                                |
| CPU               | 1 VirtualCPU                                 |

## Installation guide
This installation guide is for RHEL8, but the steps can be adapted for RHEL7 (using `rhel7` instead of `rhel8`).

* `curl https://repository.ercole.io/shared/ercole-rhel8-noarch.repo | tee /etc/yum.repos.d/ercole-noarch.repo`
* `yum install ercole-web`
The website files can be found under `/usr/share/ercole/web/`.
If you want setup nginx for serving the files and proxy-pass you can follow this [HOWTO](#how-to-setup-ercole-ercole-web-with-nginx-and-proxypass).

## Configuration
Ercole-web has a single file and it's stored in `/usr/share/ercole/web/config.json`. The file isn't tought to be modified by hand but it's generated by `ercoleweb-setup` util using the values inside the file `/etc/ercole/conf.d/20-ercolesetup.toml`.