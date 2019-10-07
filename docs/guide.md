# Getting Started

## Ercole server installation

### Requirements

|     Component     | Prerequisite                                 |
|:-----------------:|----------------------------------------------|
| Operating system  | CentOS, RedHat, OracleLinux 7                |
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

* Restart postgresql

```
systemctl restart "postgresql service"
```

* Install rpm Ercole Server 

```
yum install "rpm_ercole_server" (ex. ercole-server-1.5.0n-1.el7.x86_64.rpm - https://github.com/ercole-io/ercole-server/releases)
```

* Configure and start Ercole Server

In order to configure ercole server you have to customize the file /opt/ercole-server/application.properties with the parameters different from the default.

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
| server.port | Ercole server port | 9080 |
| server.servlet.session.timeout | Session timeout | 30m |

* systemctl daemon-reload
* systemctl start ercole-server

## Ercole agent installation

In order to permit the correct comunication between agent and server, you have to open these port on your firewall from agent to server (one way):

* 9080  if you want http communication protocol
* 443 if you want https communication protocol

::: warning ATTENZIONE
If you want to use https communication protocol, you have to provide a signed certificate
:::

### Operating System support

* Red Hat/Oracle Linux/CentOS 5.x-6.x-7.x (only 7.x for the virtualization agent)
* Microsoft Windows 2008R2 - 2012 - 2012R2 - 2016

### Database support

* Oracle RDBMS 9i 10g 11g 12c 18c 19c 

### RHEL/OEL/CentOS Installation

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
| oratab | Override the default oratab filename |  |

* Now you can start the service:

```
service ercole-agent start
```

You can check the execution through the journalctl (Linux 7): 

```
journalctl -u ercole-agent -f
```

You can find the log on /var/log/ercole-agent.log (Linux 5 & 6).

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


### HP-UX 11.3 Installation

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

* Download/get agent:

```
https://<ip_ercole_server>/packages/ercole-agent-hpux-latest.tar.gz
```

* Extract and install it:
```
mkdir ercole-agent-hpux-latest
cd ercole-agent-hpux-latest
tar -zxvf ../ercole-agent-hpux-latest.tar.gz
cd ..
cp -r ercole-agent-hpux-latest /opt/ercole-agent-hpux       
cp ercole-agent-hpux-latest/daemon_script/ercole-agent /sbin/init.d/ercole-agent
```

* Agent configuration

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
| oratab | Override the default oratab filename |  |

* Now you can start the service:

```
/sbin/init.d/ercole-agent start
```

You can find the log on /var/adm/ercole-agent.log.

## Ercole agent installation

#### Requirements for VMWare

* PowerShell version >= 2
* VSphere power CLI module
* Open port 443 from ercole-agent-virtualization to ovmmanager 
* Read only user access to the VSphere
* Set this powershell option: "Set-PowerCLIConfiguration -Scope User -ParticipateInCEIP $false -InvalidCertificateAction ignore"

#### Requirements for Oracle VM

* ovm_vmcontrol installed on ovm manager
* Key exchange with ovm manager user who can run ovm_vmcontrol
* Vms must not contain spaces (they will be ignored)
* sshpass installed on server that have ercole-agent-virtualization installed
* ovmcli installed on ovmmanager (From version 3.2.1)
* Port 10000 open from ercole-agent-virtualization to ovmmanager

#### Installation

* Install agent as root user:

```
yum install -y https://<ip_ercole_server>/packages/ercole-agent-virtualization-<version>-1.el7.x86_64.rpm
```

Once you have installed the agent, you have to insert the VMware VCenter/OVM Manager credentials/settings in the config.json file.
For example:
```
    "hypervisors": [
        { 
            "type": "vmware", 
            "endpoint": "10.20.30.40", 
            "username": "reader@vsphere.local", 
            "password": "reader"
        },
        {
            "type": "ovm",
            "endpoint": "10.20.30.40",
            "username": "reader",
            "password": "R34d3r",
            "ovmuserkey": "92838932423",
            "ovmcontrol": "/path/to/ovmcontrol"
        }
    ]
```

If you use only one technology you have to delete the rows about the technology that you won't use.

* systemctl start ercole-agent-virtualization
