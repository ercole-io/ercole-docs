# Getting Started

## Ercole server installation

### Requirements

|     Component     | Prerequisite                                 |
|:-----------------:|----------------------------------------------|
| Operating system  | Centos, RedHat, OracleLinux 7                |
| RAM               | 4GB                                          |
| Filesystem        | 50GB (minimum)                               |
| CPU               | 2 VirtualCPU                                 |
| Database          | PostgreSQL >= 9.6                            |
| Software          | java-11-openjdk                              |
| Network           | port 9080 (HTTP) or 443 (HTTPS) open         | 

### Installation 

* Postgresql db creation

```
$ psql
postgres-# create database ercole; 
postgres-# create user ercole with password 'ercole';    
postgres-# alter database ercole owner to ercole;
```

* Modify pg_hba.conf

```
vi <Postgresql data directory>/pg_hba.conf  <-- ex. /var/lib/pgsql/9.6/data/pg_hba.conf
```

```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
# "local" is for Unix domain socket connections only
local   all             all                                     md5
# IPv4 local connections:
host    all             all             127.0.0.1/32            md5
# IPv6 local connections:
host    all             all             ::1/128                 ident
# Allow replication connections from localhost, by a user with the
# replication privilege.
local   replication     all                                     peer
host    replication     all             127.0.0.1/32            ident
host    replication     all             ::1/128                 ident
```

* OS user creation

```
useradd -s /bin/bash -g users -d /home/ercole -m ercole 
mkdir -p /opt/ercole-server/{log,conf} 
chown ercole.users /opt/ercole-server/log
```

* Install rpm Ercole Server 

```
yum install "rpm_ercole_server" (ex. ercole-server-1.5.0n-1.el7.x86_64.rpm)
```

* Configure and start Ercole Server

In order to configure ercole server you have to customize the file /opt/ercole-server/application.properties with the paramters different from the default.

Main parameter are:

| Parameter | Description | Default |
|----------------------------|------------------------------|-----------------------------------------|
| spring.datasource.url | Postgres database connection | jdbc:postgresql://localhost:5432/ercole |
| spring.datasource.username | DB user | ercole |
| spring.datasource.password | DB user password | ercole |
| user.normal.name | Ercole server user | user |
| user.normal.password | Ercole server user password | password |
| agent.user | Ercole agent user | user |
| agent.password | Ercole agent user password | password |
| agent.password | Ercole agent user password | password |
| server.port | Ercole server port | 9080 |

* systemctl daemon-reload
* systemctl start ercole.service
* systemctl enable ercole.service

### Configuration


## Ercole agent installation

In order to permit the correct comunication between agent and server, you have to open these port on your firewall from agent to server (one way):

* 9080  if you want http communication protocol
* 443 if you want https communication protocol

::: warning ATTENZIONE
If you want to use https communication protocol, you have to provide a signed certificate
:::

### Operating System support

* Red Hat/Oracle Linux/CentOS 5.x-6.x-7.x
* Microsoft Windows 2008R2 - 2012 - 2012R2 - 2016

### Database support

* Oracle RDBMS 9i 10g 11g 12c 18c 19c 

### RHEL/OEL/CENTOS Installation

#### Requirements

* All the Oracle Database must be in the oratab file:

```
# This file is used by ORACLE utilities.  It is created by root.sh
# and updated by either Database Configuration Assistant while creating
# a database or ASM Configuration Assistant while creating ASM instance.

# A colon, ':', is used as the field terminator.  A new line terminates
# the entry.  Lines beginning with a pound sign, '#', are comments.

# Entries are of the form:
#   $ORACLE_SID:$ORACLE_HOME:<N|Y>:
#
# The first and second fields are the system identifier and home
# directory of the database respectively.  The third field indicates
# to the dbstart utility that the database should , "Y", or should not,
# "N", be brought up at system boot time.
#
# Multiple entries with the same $ORACLE_SID are not allowed.
#
#
ERCOLE:/data/app/oracle/product/12.2.0/dbhome_1:N
```

#### Installation

* Install agent as root user:

```
yum install -y https://<ip_ercole_server>/packages/ercole-agent-latest-1.el<5-6-7>.x86_64.rpm
```

* Agent configuration

The installer will create the service "ercole-agent" and the default path will be /opt/ercole-agent.
Before starting the agent, you have to modify the config.json file, located on the installation path. 


| Parameter | Description | Default |
|------------------------|---------------------------------------------------------------------------------------|-----------|
| Hostname | if "default" the agent takes the server hostname, otherwise it takes the name written | default |
| envtype | It accepts what you want (es. Production, PRD or PROD) | ercole |
| location | It accepts what you want (es. Italy, IT or DC_IT) | ercole |
| serverurl | Ercole server address | user |
| serverusr | Ercole server user | password |
| serverpsw | Ercole server password | user |
| frequency | Schedulation window in hour (1 in a day by default) | password |
| forcestats | If true it forces DBA_FEATURE_USAGE_STATISTICS refresh (recommended) |  |
| EnableServerValidation | If false it accepts certificate self signed or not acknowledged |  |
| ForcePwshVersion | Insert the powershell version if the version is different (only for windows) |  |

* Now you can start the service:

```
service ercole-agent start
```

You can check the execution through the journalctl (Linux 7): 

```
journalctl -u ercole-agent -f
```

You can find the log on /var/log/ercole-agent.log (Linux 5 & 6): 

### Windows installation

#### Requirements

* PowerShell version >= 2

#### Installation

* Download the agent installer from the page "Agent" on the Ercole Server Main page.

* Execute (with administrator privilege) the file ercole-agent-setup-ERCOLE_VERSION.exe 

The installer will create the service "ercole-agent" and the default path will be c:\ercole-agent.

* Agent configuration

Before starting the agent, you have to modify the config.json file, located on the installation path.

| Parameter | Description | Default |
|------------------------|---------------------------------------------------------------------------------------|-----------|
| Hostname | if "default" the agent takes the server hostname, otherwise it takes the name written | "default" |
| envtype | It accepts what you want (es. Production, PRD or PROD) | ercole |
| location | It accepts what you want (es. Italy, IT or DC_IT) | ercole |
| serverurl | Ercole server address | user |
| serverusr | Ercole server user | password |
| serverpsw | Ercole server password | user |
| frequency | Schedulation window in hour (1 in a day by default) | password |
| forcestats | If true it forces DBA_FEATURE_USAGE_STATISTICS refresh (recommended) |  |
| EnableServerValidation | If false it accepts certificate self signed or not acknowledged |  |
| ForcePwshVersion | Insert the powershell version if the version is different (only for windows) |  |

* Now you can start the service ercole-service.

::: danger DEBUG
If you want to debug the execution of the agent, you can execute it directly into the command line prompt from the base directory (ex. /opt/ercole-agent)
:::