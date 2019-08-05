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
| Software          | Java 1.8                                     |

### Installation 

* Postgresql db creation

```
psql create database ercole; 
create user ercole with password 'ercole';    
alter database ercole owner to ercole;
```

* Modify pg_hba.conf

vi <Postgresql data directory>/pg_hba.conf  <-- ex. /var/lib/pgsql/9.6/data/pg_hba.conf

```
# TYPE DATABASE USER ADDRESS METHOD 
# "local" is for Unix domain socket connections only 
local all all trust 
local all all peer 
# IPv4 local connections: 
host all all 127.0.0.1/32 trust 
# IPv6 local connections: 
host all all ::1/128 trust 
# Allow replication connections from localhost, by a user with the 
# replication privilege. 
#local replication postgres trust 
#host replication postgres 127.0.0.1/32 trust 
#host replication postgres ::1/128 trust
```

* OS user creation

```
useradd -s /bin/bash -g users -d /home/ercole -m ercole 
mkdir -p /opt/ercole-server/{log,conf} 
chown ercole.users /opt/ercole-server/log
```

* Download and copy Ercole Server 

```
mv ercole-server-1.3.1.jar /opt/ercole-server 
mv ercole-server.sh /opt/ercole-server 
mv application-prod.properties /opt/ercole-server/conf 
mv ercole-server.service /etc/systemd/system
```

* Create,enable and start Ercole Server

```
vi /etc/systemd/system/ercole.service

[Unit]
Description=Manage Java service
[Service]
WorkingDirectory=/opt/ercole-server
ExecStart=/bin/java -Xms128m -Xmx256m -jar /opt/ercole-server/ercole-server-<version>.jar
User=ercole
Type=simple
Restart=on-failure
RestartSec=10
[Install]
WantedBy=multi-user.target
```

* systemctl daemon-reload
* systemctl start ercole.service
* systemctl enable ercole.service

### Configuration


## Ercole agent installation

In order to permit the correct comunication between agent and server, you have to open these port on your firewall from agent to server (one way):

* 80  if you want http communication protocol
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


```
vi /opt/ercole-agent/config.json

{
    "hostname": "default",                                       <-- if "default" the agent takes the server hostname, otherwise it takes the name written
    "envtype": "<PRD/TST/SVL>",                                  <-- It accepts what you want (es. Production, PRD or PROD)
    "location": "<Italy/Germany/DC1/DC2/DC3/...>",               <-- It accepts what you want (es. Italy, IT or DC_IT)
    "serverurl": "<url_ercole_server>/host/update",              <-- Ercole server address
    "serverusr": "<User configurated in Ercole Server>",         <-- Ercole server  username
    "serverpsw": "<Password configurated in Ercole Server>",     <-- Ercole server Password
    "frequency": 24,                                             <-- Schedulation window in hour (1 in a day by default)
    "forcestats": true,                                          <-- If true it forces DBA_FEATURE_USAGE_STATISTICS refresh (recommended)
    "EnableServerValidation": false,                             <-- If false it accepts certificate self signed or not acknowledged
    "ForcePwshVersion": "0"                                      <-- Not used on linux agent
}
```

* Now you can start the service:

```
service ercole-agent start
```
You can check the execution through the journalctl: 

```
journalctl -u ercole-agent -f
```

### Windows installation

#### Requirements

* PowerShell version >= 2

#### Installation

* Download the agent installer from the page "Agent" on the Ercole Server Main page.

* Execute (with administrator privilege) the file ercole-agent-setup-ERCOLE_VERSION.exe 

The installer will create the service "ercole-agent" and the default path will be c:\ercole-agent.

* Agent configuration

Before starting the agent, you have to modify the config.json file, located on the installation path.

```
{
    "hostname": "default",                                       <-- if "default" the agent takes the server hostname, otherwise it takes the name written
    "envtype": "<PRD/TST/SVL>",                                  <-- It accepts what you want (es. Production, PRD or PROD)
    "location": "<Italy/Germany/DC1/DC2/DC3/...>",               <-- It accepts what you want (es. Italy, IT or DC_IT)
    "serverurl": "<url_ercole_server>/host/update",              <-- Ercole server address
    "serverusr": "<User configurated in Ercole Server>",         <-- Ercole server  username
    "serverpsw": "<Password configurated in Ercole Server>",     <-- Ercole server Password
    "frequency": 24,                                             <-- Schedulation window in hour (1 in a day by default)
    "forcestats": true,                                          <-- If true it forces DBA_FEATURE_USAGE_STATISTICS refresh (recommended)
    "EnableServerValidation": false,                             <-- If false it accepts certificate self signed or not acknowledged
    "ForcePwshVersion": "0"                                      <-- Insert the powershell version if the version is different
}
```

* Now you can start the service ercole-service.

::: danger DEBUG
If you want to debug the execution of the agent, you can execute it directly into the command line prompt
:::