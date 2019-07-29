# Getting Started

## Installare Ercole Server

### Prerequisiti

|     Componente    | Requisito                                    |
|:-----------------:|----------------------------------------------|
| Sistema Operativo | Centos, RedHat, OracleLinux 7                |
| RAM               | 4GB                                          |
| Spazio disco      | 50GB (Valutare anche in base alla retention) |
| Processore        | 2 VirtualCPU                                 |
| Database          | PostgreSQL >= 9.6                            |
| Software          | Java 1.8                                     |

### Installazione 

### Configurazione


## Installing Ercole Agent

Al fine di consentire la counicazione tra agent e server è necessario aprire le seguenti porte dall'agent verso il server:

* 80  in caso di configurazione in http
* 443 in caso di configurazione in https

::: warning ATTENZIONE
L'apertura delle porte dall'agent verso il server dovrà sempre essere presente in quanto ERCOLE scambia dati periodicamente con il server.
:::

### Sistemi operativi supportati:

* Red Hat/Oracle Linux/Centos versione 5-6-7
* A partire da Windows Server 2008 R2  

### Database supportati:

* Oracle RDBMS 10g 11g 12c 18c 19c

### RHEL

#### Prerequisiti

* File oratab compilato con ORACLE_SID:ORACLE_HOME:<N/Y>

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

#### Installazione 

Eseguire l'install dell'agent in base alla versione di sistema operativo presente:

```
yum install -y https://<ip_ercole_server>/packages/ercole-agent-latest-1.el<5-6-7>.x86_64.rpm
```

L'agent viene installato nella directory /opt/ercole-agent e viene creato il servizio ercole-agent.
Prima di procedere con lo start è necessario modificare il file di connfigurazione:

```
vi /opt/ercole-agent/config.json

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