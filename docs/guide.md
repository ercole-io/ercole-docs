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

### Configuration


## Ercole agent installation

In order to permit the correct comunication between agent and server, you have to open these port on your firewall from agent to server (one way):

* 80  if you want http communication protocol
* 443 if you want https communication protocol

::: warning ATTENZIONE
If you want to use https communication protocol, you have to provide a signed certificate
:::

### Operating System support:

* Red Hat/Oracle Linux/CentOS 5.x-6.x-7.x
* Microsoft Windows 2008R2 - 2012 - 2012R2 - 2016

### Database support:

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

#### Installation steps 

Install agent as root user:

```
yum install -y https://<ip_ercole_server>/packages/ercole-agent-latest-1.el<5-6-7>.x86_64.rpm
```

The installer will create the service "ercole-agent" and the default path will be /opt/ercole-agent.
Before starting the agent, you have to modify the config.json file, locate on the installation path. 


```
vi /opt/ercole-agent/config.json

{
    "hostname": "default",
    "envtype": "<PRD/TST/SVL>",
    "location": "<Italy/Germany/DC1/DC2/DC3/...>",
    "serverurl": "<url_ercole_server>/host/update",
    "serverusr": "<User configurated in Ercole Server>",
    "serverpsw": "<Password configurated in Ercole Server>",
    "frequency": 24,
    "forcestats": false,
    "EnableServerValidation": false,
    "Pwsh": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
    "ForcePwshVersion": "0"
}
```

A questo punto è possibile lo start del servizio:

```
service ercole-agent start
```
I log vengono scritti nel journal quindi è possibile verificare tramite comando:

```
journalctl -u ercole-agent -f
```

### Windows

#### Prerequisiti

* PowerShell versione >= 2

#### Installazione

Collegarsi tramite broswer all'indirizzo di Ercole server, selezionare la voce agent nel menù di sinistra e cliccare sull'agent per windows. 

Lanciare con privilegi amministrativi  ercole-agent-setup-ERCOLE_VERSION.exe 

L'agent viene installato nella directory C:\ErcoleAgent e viene creato il servizio Ercole Agent.

Modificare il file di configurazione C:\ErcoleAgent\config.json con un editor di testo nel seguente modo:

```
{
    "hostname": "default",
    "envtype": "<PRD/TST/SVL>",
    "location": "<Italy/DC1/DC2/DC3/...>",
    "serverurl": "<url_ercole_server>/host/update",
    "serverusr": "<User configurated in Ercole Server>",
    "serverpsw": "<Password configurated in Ercole Server>",
    "frequency": 24,
    "forcestats": false,
    "EnableServerValidation": false,
    "Pwsh": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
    "ForcePwshVersion": "0"
}
```

::: danger ATTENZIONE
Per far si che il servizio funzioni è necessario che sia presente una versione di Powershell >= 2, nel caso in cui non sia installata nel PATH di default inserire manualmente il PATH nel file di configurazione sopra citato
:::

A questo punto è possibile avviare il servizio Ercole Agent andando in Services.msc e facendo lo start.