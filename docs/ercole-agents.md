# Ercole-agent and ercole-agent-perl
Ercole-agent and ercole-agent-perl are the data collectors that fetches some informations from various sources like the host and the software. Organize them in a JSON structure called hostdata and send them to the dataservice. 

## Differences
There are two different variant of ercole-agent: ercole-agent (go) and ercole-agent-perl. Their main differences are the programming language, operating system support and feature/targets support. It's advised to stick to ercole-agent (go)

| Feature                               | Ercole-agent (go) | Ercole-agent-perl |
|:--------------------------------------|:------------------|:------------------|
| Programming Language                  | Go 1.18           | Perl 5.8.8        |
| Linux (generic) support               | yes[1]            | no                |
| Windows Server >= 2008R2 support      | yes               | no                |
| Solaris operating system support      | no                | yes[2]            |
| AIX operating system support          | no                | yes               |
| HP-UX operating system support        | no                | yes[2]            |
| Virtualization                        | yes               | no                |
| (virtualization) Oracle/VM target     | yes               | no                |
| (virtualization) VMWare/VMWare target | yes               | no                |
| Oracle/Database target                | yes               | yes               |
| Oracle/Exadata target                 | yes               | no                |
| Microsoft/SQLServer target            | yes               | no                |
| MariaDBFoundation/MariaDB target      | no                | no                |
| PostgreSQL/PostgreSQL target          | yes[3]            | no                |
| Oracle/MySQL target                   | yes[3]            | no                |

[1] It's packaged only for RHEL5, RHEL6, RHEL7, RHEL8, DEB.

[2] It isn't already properly packaged.

[3] It's packaged only for RHEL6, RHEL7, RHEL8, DEB.

## Ercole-agent (go)
### RHELx installation
The installations instructions are written for RHEL8, but they are also applicable to older RHEL versions.
1. `curl https://repository.ercole.io/shared/ercole-rhel8-x86_64.repo | tee /etc/yum.repos.d/ercole-x86_64.repo`
2. `yum install ercole-agent`

### DEB installation
1. Download the correct file from [https://repository.ercole.io/api/deb/deb/x86_64/](https://repository.ercole.io/api/deb/deb/x86_64/).
2. Install the DEB file downloaded.

### Windows installation
On windows it's required to have powershell >= 3.
1. Download the correct file from [https://repository.ercole.io/api/win/win/x86_64/](https://repository.ercole.io/api/win/win/x86_64/).
2. Click to the setup and follow the installation wizard. 

### Operating system level differences
|                                       | RHEL5   | RHEL6     | RHEL7     | RHEL8     | DEB       | Windows      |
|:--------------------------------------|:--------|:----------|:----------|:----------|:----------|:-------------|
| Service handling program              | service | systemctl | systemctl | systemctl | systemctl | services.msc |
| Fetcher alternative user support      | Yes     | Yes       | Yes       | Yes       | Yes       | No           |
| Powershell required                   | No[1]   | No[1]     | No[1]     | No[1]     | No[1]     | Yes          |
| `Features.OracleDatabase.Oratab` used | Yes     | Yes       | Yes       | Yes       | Yes       | No           |
| `ForcePwshVersion` property used      | No      | No        | No        | No        | No        | Yes          |
| Virtualization support                | Yes     | Yes       | Yes       | Yes       | Yes       | No           |
| Oracle/Database support               | Yes     | Yes       | Yes       | Yes       | Yes       | Yes          |
| Oracle/Exadata support                | Yes     | Yes       | Yes       | Yes       | Yes       | No           |
| Microsoft/SQLServer support           | No      | No        | No        | No        | No        | Yes          |
| PostgreSQL/PostgreSQL support         | No      | Yes       | Yes       | Yes       | Yes       | No           |  
| Oracle/MySQL support                  | No      | Yes       | Yes       | Yes       | Yes       | No           |

[1] Except when Virtualization feature is enabled

### Configuration
Ercole-agent can be configured modifying the content of the `config.json` stored in these files/directory in ascending order of priority. The properties specified in low priority configuration files are overriden by the values in high priority configuration files on Linux:
  * /opt/ercole-agent/config.json
  * /usr/share/ercole-agent/config.json
  * /etc/ercole-agent/ercole-agent.json
  * /etc/ercole-agent/conf.d/*.json
  * ./config.json
  
  or `C:\ErcoleAgent\config.json` on Windows.

The configuration properties are:
* `Hostname`: If the value is `default`, the hostname is detected from the host, otherwise it's the value of the `Hostname` property. The default value is `default`.
* `Environment`: It's the environment of the machine. e.g TST, PRD, DEV, COLL, ...
* `Location`: It's the physical location of the host. e.g Italy, Germany, France, ...
* `Queue`: Contains specific dataservice configurations.
* `Queue.Dataservices`: It's an array that contains all the dataservices you want to send data.
* `Queue.WaitingTime`: It's the time (minute) to wait before retry to send data.
* `Queue.RetryLimit`: It's the maximum number of attempts.
* `Queue.Dataservices[].url`: It's the base URL of ercole-dataservice to which are sent the hostdatas.
* `Queue.Dataservices[].AgentUser`: It's the username used by agent to be authenticated by ercole-dataservice.
* `Queue.Dataservices[].AgentPassword`: It's the password used by agent to be authenticated by ercole-dataservice.
* `Queue.Dataservices[].EnableServerValidation`: True if ercole-agent must validate ercole-dataservice https certificate.
* `Period`: It's the number of hour between different runs.   
            This value is also used in Ercole back-end: after this threshold a NO_DATA alert is thrown by the FreshnessCheckJob.
* `ForcePwshVersion`: Use a specific version of powershell. Used only on windows.
* `ParallelizeRequests`: True if ercole-agent must run the fetchers in parallel. Otherwise false.
* `Verbose`: Add verbosity to agent logging even the debug level logs.
* `LogDirectory`: Log in a file in this directory, instead of stdout (if left empty).
* `Features`: Contains specific configuration of the targets/features, see below.

### Virtualization target
#### Requirements
##### VMWare/VMWare:
* PowerShell(pwsh) version >= 2
* [VSphere power CLI module](https://thesysadminchannel.com/install-vmware-powercli-module-powershell/)
* Access to vSphere via the 443 port
* Read only user access to vSphere
* PowerCLI is configured with the following command. `Set-PowerCLIConfiguration -Scope User -ParticipateInCEIP $false -InvalidCertificateAction ignore`
##### Oracle/VM
* `ovm_vmcontrol` installed on the ovm manager
* Key exchange with ovm manager user who can run `ovm_vmcontrol`
* VMs names must not contain spaces (they will be ignored)
* `sshpass` is installed
* `ovmcli` installed on ovmmanager (From version 3.2.1)
* Access ovmmanager via 10000 port
##### Oracle/OLVM
* Obtain the CA certificate from the oVirt Engine: `openssl s_client -connect <OLVM-FQDN>:443 -showcerts < /dev/null`
* Import the CA certificate to the client machine where is installed ercole-agent  
 To import the certificate in Linux:   
    `scp root@<OLVM-FQDN>:/etc/pki/ovirt-engine/ca.pem /etc/pki/ca-trust/source/anchors/`  
    `update-ca-trust`  
 To import the certificate in Windows:  
   `Install the certificate in Trusted Root Certification Authorities` 
* The user used to authenticate the agent must have `ReadOnlyAdmin` role
#### Configuration
* `Features.Virtualization.Enabled`: true if Virtualization support should be enabled.
* `Features.Virtualization.FetcherUser`: name of the user that should be used for fetching the informations. If the value is empty, it's the user that is running the agent.
* `Features.Virtualization.Hypervisors`: list of the hypervisors from which the clusters/vms list is fetched.
* `Features.Virtualization.Hypervisors[].Type`: contains the type of the hypervisors. Valid values are `vmware`, `ovm`, `olvm`.
* `Features.Virtualization.Hypervisors[].Endpoint`: contains the endpoint of the hypervisor, e.g vSphere or ovmmanager ip address.
* `Features.Virtualization.Hypervisors[].Username`: contains the username used to authenticate the agent.
* `Features.Virtualization.Hypervisors[].OvmUserKey`: only for `ovm` type: it's the user ID of the user on ovmmanger that have exchanged keys with the components. 
* `Features.Virtualization.Hypervisors[].OvmControl`: only for `ovm` type: contains the /path/to/ovmcontrol.

### Oracle/Database target
#### Requirements
* Oracle Database version >= 9i

#### Configuration
* `Features.OracleDatabase.Enabled`: true if Oracle/Database support should be enabled.
* `Features.OracleDatabase.FetcherUser`: name of the user that should be used for fetching the informations. If the value is empty, it's the user that is running the agent.
* `Features.OracleDatabase.Oratab`: it's the /path/to/the/oratab, the file that contains the list of DBs
* `Features.OracleDatabase.AWR`: it's the number of Automatic workload repository
* `Features.OracleDatabase.Forcestats`: true if enable the running of fetch/stats fetcher

### Oracle/Exadata target
#### Requirements
All Exadata configurations are currently supported (Bare Metal - RoCE/InfiniBand -, KVM and Xen)
To work, the user will need to configure the component list files at setup time. This files will reside in the installation directory (usually /opt/ercole-agent) and are named as follows:
* .dbs_group: MANDATORY, contains a list of the physical compute nodes
* .cell_group: MANDATORY, contains a list of the cell servers
* .ibs_group: NON-MANDATORY, contains a list of the InfiniBand switches installed. If such configuration file is not found, the agent will assume Exadata is setup with RoCE interconnect

#### Configuration
The agent can run either with root or non-root users, this is configured using parameter 'Features.OracleExadata.FetherUser' (mentioned below). In both setup, the user chosen must have passwordless access to all the components listed in the above configuration files (user-to-user for compute nodes, user-to-root for the others. If the chosen running user is root, it will always be root-to-root)
Such user (if non-root), must also be given the permissions to run the following MINIMUM REQUIREMENTS commands with sudo (NOPASS option must be used):
* ipmitool sunoem cli *
* dmidecode *
* dbmcli -e list *
* xm info
* xm list
* vm_maker --list *
* vm_maker --list-domains
* grep * /tmp/.ErcoleAgent_Exa*.lst
* rm -f /tmp/.ErcoleAgent_Exa*.lst

##### N.B.:
* only on agent for each DB machine is required to be installed for this feature to work. If your setup requires the agent to be installed on all compute nodes, the Exadata feature MUST be enabled only on a single host
* the DB machine name must be declared manually in the following configuration file: /opt/ercole-agent/config.json
* in either configuration available for the Exadata feature to run (root or non-root user), the ercole-agent service MUST be configured to run as the root user

### Oracle/MySQL target
#### Requirements
* The service user to access to the instance needs these grants:   
    `GRANT PROCESS ON *.* TO 'user'@'%';`  
    `GRANT SHOW DATABASES ON *.* TO 'user'@'%';`  
    `GRANT SELECT ON *.* TO 'user'@'%';`

#### Configuration
* `Features.MySQL.Enabled`: true if Oracle/MySQL support should be enabled.
* `Features.MySQL.Instances[].Host`: name of the host where the server is running.
* `Features.MySQL.Instances[].Port`: port number where the server is running. If it is omitted, the used default port number is 3306.
* `Features.MySQL.Instances[].User`: username used by agent to be authenticated by MySQL.
* `Features.MySQL.Instances[].Password`: password used by agent to be authenticated by MySQL.

### PostgreSQL/PostgreSQL target
#### Requirements
* PostgreSQL version >= 9  
* The service user to access to the instance needs these grants:   
 Version 9.*  
    `CREATE USER 'user' WITH LOGIN ENCRYPTED PASSWORD 'insert_pw_here';`  
    `GRANT SELECT ON pg_catalog.pg_largeobject TO 'user';`  
    `GRANT SELECT ON pg_catalog.pg_authid TO 'user';`  
 Version >= 10  
    `CREATE USER 'user' WITH LOGIN PASSWORD 'insert_pwd_here';`  
    `SELECT format('GRANT CONNECT ON DATABASE %I TO 'user';', datname) FROM pg_database \gexec;`  
    `--the following line must be run while connected to each database`  
    `ALTER DEFAULT PRIVILEGES FOR ROLE 'user' IN SCHEMA pg_catalog, information_schema GRANT SELECT ON TABLES TO 'user';`  
    `GRANT pg_read_all_settings TO 'user';`  
    `GRANT pg_read_all_stats TO 'user';`  
    `GRANT SELECT ON ALL TABLES IN SCHEMA pg_catalog TO 'user';`  
    `GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO 'user';`  
    
#### Configuration
* `Features.PostgreSQL.Enabled`: true if PostgreSQL/PostgreSQL support should be enabled.
* `Features.PostgreSQL.FetcherUser`: name of the user that should be used for fetching the informations. If the value is empty, it's the user that is running the agent.
* `Features.PostgreSQL.Instances[].Port`: port number where the server is running.
* `Features.PostgreSQL.Instances[].User`: username used by agent to be authenticated by PostgreSQL.
* `Features.PostgreSQL.Instances[].Password`: password used by agent to be authenticated by PostgreSQL.

### Microsoft/SQLServer target
#### Requirements
* The service user needs administration permissions to access to the instances (Trusted connection)
* TCP/IP protocol connections is enabled on the instances
* ercole-agent service need to have a setted user
* SQLServer version = 2019

#### Configuration
* `Features.MicrosoftSQLServer.Enabled`: true if Microsoft/SQLServer support should be enabled.
* `Features.MicrosoftSQLServer.FetcherUser`: name of the user that should be used for fetching the informations. If the value is empty, it's the user that is running the agent.

### MongoDB/MongoDB target
#### Requirements
* MongoDB version >= 4.2.0
  
#### Configuration
* `Features.MongoDB.Enabled`: true if MongoDB/MongoDB support should be enabled.
* `Features.MongoDB.FetcherUser`: name of the user that should be used for fetching the informations. If the value is empty, it's the user that is running the agent.
* `Features.MongoDB.Instances[].Host`: name of the host where the server is running.
* `Features.MongoDB.Instances[].Port`: port number where the server is running.
* `Features.MongoDB.Instances[].User`: username used by agent to be authenticated by MongoDB.
* `Features.MongoDB.Instances[].Password`: password used by agent to be authenticated by MongoDB.
* `Features.MongoDB.Instances[].DirectConnection`: true to force operations to run on the host specified in connection URI.

## `ercole agent` CLI usage
Ercole agent is thought as a CLI program, you can run commands and get help about them with the `--help` flag.

Relevant command is:
* `ercole-agent check-oratab` manage oratab file: set oratab file with expected values.

## Ercole-agent-perl
#### Requirements
* perl >= 5.8.8
* Oracle Database version >= 9i

### Solaris installation
1. Download the agent from the repository
2. `cd /`
3. `tar xvf /path/to/ercole-agent-perl-<version>-1.solaris11.noarch.tar.gz` 
4. `svcadm restart manifest-import`
5. `svcadm enable ercole-agent-perl`

#### Maintenance
* The service can be restarted with `svcadm restart ercole-agent-perl`.
* The log can be usually found in `/var/svc/log/ercole-agent-perl:default.log`.
* The state can be queried with `svcs -x ercole-agent-perl`

### AIX installation
1. Download the agent from the repository
2. `useradd -g dba -d /home/ercole-agent -m -s /bin/bash -c "Ercole agent user" ercole`
4. `touch /var/log/ercole-agent-perl.log`
5. `chown ercole /var/log/ercole-agent-perl.log`
6. `rpm -ivh ercole-agent-perl-<version>-1.aix6.1.noarch.rpm`
7. `/etc/rc.d/init.d/ercole-agent-perl start`

#### Maintenance
* The service can be restarted with `/etc/rc.d/init.d/ercole-agent-perl restart`.
* The log can be usually found in `/var/log/ercole-agent-perl.log`.
* The state can be queried with `ps -ef | grep ercole-agent`

### HPUX installation
1. Download the agent from the repository
1. `cd /`
1. `tar xvf /path/to/ercole-agent-perl-<version>-1.hpux.noarch.tar.gz` 
1. `useradd -g dba -d /home/ercole-agent -m -s /bin/bash -c "Ercole agent user" ercole`
1. `touch /var/adm/ercole-agent-perl.log`
1. `chown ercole /var/adm/ercole-agent-perl.log`
1. `/sbin/init.d/ercole-agent-perl start`

#### Maintenance
* The service can be restarted with `/sbin/init.d/ercole-agent-perl restart`.
* The log can be found in `/var/adm/ercole-agent-perl.log`.
* The state can be queried with `ps -ef | grep ercole-agent`

### Configuration
Ercole-agent-perl can be configured modifying the content of the `config.json` stored in `/opt/ercole-agent/config.json` (Linux).
The configuration properties are:
* `hostname`: If the value is `default`, the hostname used to identifying the agents is the hostname of the host, otherwise it's the value of the `Hostname` property. The default value is `default`.
* `envtype`: It's the environment of the machine. e.g TST, PRD, DEV, COLL, ...
* `location`: It's the physical location of the host. e.g Italy, Germany, France, ...
* `serverurl`: It's the base URL of ercole-dataservice to which are sent the hostdatas.
* `serverusr`: It's the username used by agent to be authenticated by ercole-dataservice.
* `serverpsw`: It's the password used by agent to be authenticated by ercole-dataservice.
* `frequency`: It's the number of hour between different runs.  
               This value is also used in Ercole back-end: after this threshold a NO_DATA alert is thrown by the FreshnessCheckJob.
* `forcestats`: True if the fetcher fetch/*/stats should be run
* `EnableServerValidation`: True if ercole-agent should validate ercole-dataservice https certificate.
* `oratab`: it's the /path/to/the/oratab, the file that contains the list of DBs
* `AWR`: it's the number of Automatic workload repository
* `UseCurl`: true if the agent should use curl to send the hostdata. Otherwise use the internal perl library. On solaris the internal library seems to not work.
* `PrettyPrintHostdata`: if true, the agent will pretty print hostdata json (with right indentation and wrapping lines) before sent.
