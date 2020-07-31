# Getting Started

## Ercole installation

### Requirements

|     Component     | Prerequisite                                 |
|:-----------------:|----------------------------------------------|
| Operating system  | CentOS, RedHat, OracleLinux 7/8              |
| RAM               | 4GB                                          |
| Filesystem        | 50GB (minimum)                               |
| CPU               | 2 VirtualCPU                                 |
| Database          | MongoDB >= 4.2.0                             |

#### Minimal default required network/firewall rules
|          From          |         To           |  Port |   Proto   |
|:----------------------:|----------------------|-------|-----------|
| ercole-reposervice     | *.github.com         |  443  | HTTPS[1]  |
| ercole-reposervice     | repository.ercole.io |  443  | HTTPS[1]  |
| agents                 | ercole-dataservice   | 11111 | HTTP[2]   |
| users                  | ercole-apiservice    | 11113 | HTTP[2]   |
| users                  | ercole-chartservice  | 11116 | HTTP[2]   |
| users                  | ercole-reposervice   | 11114 | HTTP[2]   |
| agents                 | ercole-reposervice   | 11114 | HTTP[2]   |
| users                  | ercole-reposervice   | 11115 | SSH       |
| agents                 | ercole-reposervice   | 11115 | SSH       |

[1] You can safely separate ercole-reposervice from the others microservices

[2] It is highly recommended to setup a reverse proxy between users/agents and ercole for avoiding to comunicate directly to the microservices using HTTP and opening too much ports, using for example nginx. See the istructions below.

### Installation guide
This installation guide is for RHEL8, but the steps can be easily adapted for RHEL7 

* `curl https://repository.ercole.io/shared/ercole-rhel8-x86_64.repo | tee /etc/yum.repos.d/ercole.repo`
* `yum install ercole`
* If your machine has multiple IP addresses, check and fix endpoints in `/etc/ercole/conf.d/20-ercolesetup.toml`
* Review ercole configuration with `ercole show-config`
* `systemctl start ercole`

Ercole is configured automatically during the installation but you can edit the configuration by creating/files in `/etc/ercole/conf.d`. Its logs can be read with the command `journalctl -u ercole-dataservice -u ercole-alertservice -u ercole-apiservice -u ercole-reposervice -u ercole-chartservice` and can be updated as usually with a simple `yum update` unless in the new versions were introduced breaking changes.
It is also recommeded to also install (jq)[https://stedolan.github.io/jq/download/].
After the installation you may want to install ercole-web and configure nginx or to install artifacts

### Ercole configuration
The configuration is written in [TOML](https://github.com/toml-lang/toml) syntax and it is stored in these files/directory in ascending order of priority. The properties specified in low priority configuration files are overriden by the values in high priority configuration files 
* `/opt/ercole/config.toml` (legacy config file) 
* `/usr/share/ercole/config.toml` (distributor config file)
* `/etc/ercole/ercole.toml`
* `/etc/ercole/conf.d/*.toml`
    * `/etc/ercole/conf.d/20-ercolesetup.toml` is a file created by `ercole-setup` utility that contains known host specific configuration like remote endpoints, paths to certificates/keys and inter microservice configuration params
* `~/.config/ercole.toml`
* `./config.toml`
* An optional file specified to the `ercole` using the `-c` option.

It's highly recommended to configure it by creating files in `/etc/ercole/conf.d` (e.g `/etc/ercole/conf.d/50-myconf.toml`). If you change the `RemoteEndpoint`s of the microservices you may need to re-run `ercole-setup`(or `ercoleweb-setup` if you have installed ercole-web).

#### (main) Configuration properties list
* `Mongodb.URI` is the uri used to connect to the mongodb database. The default value is `mongodb://localhost:27017/ercole`
* `Mongodb.DBName` is the name of the mongodb database. The default value is `ercole`
* `Mongodb.Migrate` contains true if ercole should update/migrate the database schema, otherwise false. The default value is `true`. When ercole is started, it try to update the structure of the database by updating the schemas, updating the documents, creating the indexes, inserting default values.
* `DataService.RemoteEndpoint` contains the URI used by clients to connect to the dataservice.
* `DataService.BindIP` contains the IP Address on which data service listen.
* `DataService.Port` contains the port on which data service listen.
* `DataService.LogHTTPRequest` enable the logging of the http request.
* `DataService.LogInsertingHostdata` enable the logging of the inserting hostdata.
* `DataService.LogDataPatching` enable the logging of data patching events.
* `DataService.EnablePatching` enable the patching of hostdata. It's required for tagging the hosts and modifying Oracle Database license count values.
* `DataService.AgentUsername` contains the username used to authenticate agents
* `DataService.AgentPassword` contains the password used to authenticate agents 
* `DataService.CurrentHostCleaningJob.Crontab` contains the (cron)[https://en.wikipedia.org/wiki/Cron] schedule expression for automatic archivial of the current (non archived). 
* `DataService.CurrentHostCleaningJob.HourThreshold` contains the maximium number of hours in which a hostdata is considered up to date. After this threshold the host will be archived by the CurrentHostCleaningJob .
* `DataService.CurrentHostCleaningJob.RunAtStartup` enable the running of the current host cleaning job at startup. 
* `DataService.ArchivedHostCleaningJob.Crontab` contains the (cron)[https://en.wikipedia.org/wiki/Cron] schedule expression for automatic deletion of archived hosts. 
* `DataService.ArchivedHostCleaningJob.HourThreshold` contains the maximium number of hours in which a archived hostdata is retained. After this threshold the archived host will be deleted by the ArchivedHostCleaningJob .
* `DataService.ArchivedHostCleaningJob.RunAtStartup` enable the running of the archived host cleaning job at startup. 
* `AlertService.RemoteEndpoint` contains the URI used by the microservices to connect to the alertservice.
* `AlertService.BindIP` contains the IP Address on which alert service listen.
* `AlertService.Port` contains the port on which alert service listen.
* `AlertService.LogHTTPRequest` enable the logging of the http request.
* `AlertService.LogMessages` enable the logging of the processing queue messages.
* `AlertService.LogAlertThrows` enable the logging of throwing alerts.
* `AlertService.PublisherUsername` contains the username used to authenticate the microservices
* `AlertService.PublisherPassword` contains the password used to authenticate the microservices
* `AlertService.FreshnessCheckJob.Crontab` contains the (cron)[https://en.wikipedia.org/wiki/Cron] schedule expression for automatic throws of NO_DATA alerts when a current host is not up to date. 
* `AlertService.FreshnessCheckJob.HourThreshold` contains the maximium number of hours in which a hostdata is considered up to date. After this threshold a NO_DATA alert is thrown by the FreshnessCheckJob.
* `AlertService.FreshnessCheckJob.RunAtStartup` enable the running of the freshness check job at startup. 
* `AlertService.Emailer.Enabled` enable the notifying of the alerts by email.
* `AlertService.Emailer.From` the source email address that is used to send emails. 
* `AlertService.Emailer.To` the destination email addresses to which are sent the emails.
* `AlertService.Emailer.SMTPServer` SMTP server used to send email.
* `AlertService.Emailer.SMTPPort` port of the SMTP server used to send email.
* `AlertService.Emailer.SMTPUsername` username used to authenticate to the SMTP server.
* `AlertService.Emailer.SMTPPassword` password used to authenticate to the SMTP server.
* `AlertService.Emailer.DisableSSLCertificateValidation` true if disable the authentication of the SMTP server.
* `APIService.RemoteEndpoint` contains the URI used by the clients to connect to the apiservice.
* `APIService.BindIP` contains the IP Address on which api service listen.
* `APIService.Port` contains the port on which api service listen.
* `APIService.LogHTTPRequest` enable the logging of the http request.
* `APIService.ReadOnly` disable the APIs that modify the data
* `APIService.EnableInsertingCustomPatchingFunction` enable the possibility to add/set a custom patching function
* `APIService.AuthenticationProvider.Type` contains the authentication type. The allowed values are `basic` and `ldap`.
* `APIService.AuthenticationProvider.Username` contains the username used to authenticate user when `Type` is `basic`. It also contains the username used by `ercole` to perform requests to APIService.
* `APIService.AuthenticationProvider.Password` contains the password used to authenticate password when `Type` is `basic`. It also contains the password used by `ercole` to perform requests to APIService.
* `APIService.AuthenticationProvider.Username` contains the username used to authenticate user when `Type` is `basic`. It also contains the username used by `ercole` to perform requests to APIService.
* `APIService.AuthenticationProvider.Password` contains the password used to authenticate password when `Type` is `basic`. It also contains the password used by `ercole` to perform requests to APIService.
* `APIService.AuthenticationProvider.PrivateKey` contains the key used to sign the authentication JWT tokens
* `APIService.AuthenticationProvider.PublicKey` contains the key used to validate the authentication JWT tokens
* `APIService.AuthenticationProvider.TokenValidityTimeout` contains the maximum number of seconds on which the token is considered valid
* `APIService.AuthenticationProvider.Host`, when `Type` is `ldap`, contains the server used to authenticate the users
* `APIService.AuthenticationProvider.Port`, when `Type` is `ldap`, contains the port used to connect to the LDAP server. e.g. 389
* `APIService.AuthenticationProvider.LDAPBase`, when `Type` is `ldap`, contains the LDAP base of the realm. e.g. dc=planetexpress,dc=com
* `APIService.AuthenticationProvider.LDAPUseSSL`, when `Type` is `ldap`, enable/disable SSL for connecting to the server.
* `APIService.AuthenticationProvider.LDAPBindDN`, when `Type` is `ldap`, contains the account used to authenticate to the LDAP server. e.g. cn=admin,dc=planetexpress,dc=com
* `APIService.AuthenticationProvider.LDAPBindPassword`, when `Type` is `ldap`, contains the password account used to authenticate to the LDAP server. e.g. GoodNewsEveryone
* `APIService.AuthenticationProvider.LDAPUserFilter`, when `Type` is `ldap`, it's unknown the purpose of this field but put `(uid=%s)` 
* `APIService.AuthenticationProvider.LDAPGroupFilter`, when `Type` is `ldap`, it's unknown the purpose of this field but put `(memberUid=%s)` 
* `APIService.OperatingSystemAggregationRules` are the rules used to map OS names + Version to product
* `RepoService.UpstreamRepositories` contains the upstream repository from which the artifacts are downloaded
    * `Name` contains the name of the repository
    * `Type` contains the type of the repository. The allowed values are `github-release`, `directory`, `ercole-reposervice`
    * `URL` contains the URL used to find the files. In the case of `github-release` it should the URL of the API that return the releases list. e.g https://api.github.com/repos/ercole-io/ercole-agent/releases. In the case of `directory` it should be the directory in which the artifacts are contained. In the case of `ercole-reposervice` it should be the url of a directory that contains the directory `all` and the file `index.json`.
* `RepoService.HTTP.Enable` contains true if reposervice should serve the files via HTTP
* `RepoService.HTTP.RemoteEndpoint` contains the url used by clients to reach the repository via HTTP
* `RepoService.HTTP.BindIP` contains the IP on which reposervice listen for HTTP requests
* `RepoService.HTTP.Port` contains the port on which reposervice listen for HTTP requests
* `RepoService.HTTP.LogHTTPRequest` true if reposervice should log for every received HTTP request
* `RepoService.SFTP.Enable` contains true if reposervice should serve the files via SFTP
* `RepoService.SFTP.RemoteEndpoint` contains the url used by clients to reach the repository via SFTP
* `RepoService.SFTP.BindIP` contains the IP on which reposervice listen for SFTP
* `RepoService.SFTP.Port` contains the port on which reposervice listen for SFTP
* `RepoService.SFTP.PrivateKey` contains the private key used by the SFTP server
* `RepoService.SFTP.LogConnections` true if reposervice should log the connections from SFTP clients
* `RepoService.SFTP.DebugConnections` true if reposervice should log degug messages of the connections from SFTP clients
* `ChartService.RemoteEndpoint` contains the URI used by the clients to connect to the chartservice.
* `ChartService.BindIP` contains the IP Address on which chart service listen.
* `ChartService.Port` contains the port on which chart service listen.
* `ChartService.LogHTTPRequest` enable the logging of the http request.

### Notes about the internal repository
Ercole repository is tought to be public and visibile to everyone so it shouldn't contains private informations like the password or private keys. The main ercole repository is (https://repository.ercole.io)[https://repository.ercole.io]. It is served via HTTP and via SFTP so you can download files in various mode like:
*   `wget http://myawesomeercole2.local:11114/ping.txt`
*   `curl http://myawesomeercole2.local:11114/ping.txt > /tmp/ping.txt`
*   `sftp -P 11115 myawesomeercole2.local/ping.txt /tmp/ping.txt`
Some repository files/directory are managed using the `ercole repo` subcommands. Others files/directories can be safely modified.

Managed files:
    * `ping.txt` is a file used to check the liveness of the microservices. It's really managed but it's recommended to not modify it
    * `index.json` contains the cached list of available artifacts. Can be safely removed for forcing the rebuild of the cache when the next `repo` subcommands is run.
    * `all/` contains the symlinks to all installed (and managed) artifacts 
    * `rhel/*` contains the RPM repositories of the packages for every RHEL versions
    * `win/*` contains various ercole-agent setup files for windows
    * `aix/` contains the RPM repositories of the packages for every AIX versions
    * `aix-tar-gz/` alternative artifacts of agents for AIX
    * `hpux/` contains the agents for HPUX
    
Unmanaged known files:
    * `shared/` contains various files like some .repo files
    * `snapshots/` is a directory present in (repository.ercole.io)[https://repository.ercole.io] that is used to store snapshots of all projects. The snapshots aren't tought to be used outside the development.

The public repository don't serve files via SFTP.
It may be a good idea to create multiple ercole reposervice for directory for stable/testing/unstable or PRD/COL/TST
### (main) ercole usage
Ercole is a command line tool so it can be used to perform some.

* `ercole version` print the version of ecole
* `ercole show-config` show the ercole's actual configuration
* `ercole fire-hostdata` send a hostdata stored in a json file or from a stdin to ercole-dataservice
* `ercole migrate` migrate the structure of the mongodb database
* `ercole serve` start the services. Every microservices can be turned on/off esplicitily using the various --enable options like --enable-dataservice
* `ercole api` is a group of subcoommands used to perform request data from ercole-apiservice
* `ercole chart` is a group of subcoommands used to perform request data from ercole-chartservice 
* `ercole repo` is a group of subcoommands used to manage the repository. Can accept the command --rebuild-cache to force the rebuild of the cache stored in `/var/lib/ercole/distributed_directory/index.json`
    * `... list` lists the artifacts detected in the upstream repositories.
    * `... info` get the informations about the specified artifacts.
    * `... install` download and install the specified artifacts
    * `... remove` uninstall the specified artifacts
    * `... update` try to find newer version of all installed artifacts and install them

### Various HOWTO/examples

#### How to install a artifact
*   The first thing to do is to find the available artifacts by running the command: ```ercole repo list```
*   Choose the artifact you want
*   Install it with for example with the command: ```ercole repo install ercole-agent/ercole-agent-rhel7@1.5.0```

#### Install a package to rhelX from the ercole-reposervice
The first thing to do is to create a repository file 
* `curl https://repository.ercole.io/shared/ercole-rhel7-x86_64.repo | tee /etc/yum.repos.d/ercole.repo`

The next thing is to install the package with yum or dnf
* `yum install ercole-agent` 