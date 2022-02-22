# Ercole-agent and ercole-agent-perl
Ercole-agent and ercole-agent-perl are the data collectors that fetches some informations from various sources like the host and the software. Organize them in a JSON structure called hostdata and send them to the dataservice. 

## Differences
There are two different variant of ercole-agent: ercole-agent (go) and ercole-agent-perl. Their main differences are the programming language, operating system support and feature/targets support. It's advised to stick to ercole-agent (go)

| Feature                               | Ercole-agent (go) | Ercole-agent-perl |
|:--------------------------------------|:------------------|:------------------|
| Programming Language                  | Go 1.14           | Perl 5.8.8        |
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
| PostgreSQL/PostgreSQL target          | no                | no                |
| Oracle/MySQL target                   | no                | no                |

[1] It's packaged only for RHEL5, RHEL6, RHEL7, RHEL8.

[2] It isn't already properly packaged.

## Ercole-agent (go)
### RHELx installation
The installations instructions are written for RHEL8, but they are also applicable to older RHEL versions.
1. `curl https://repository.ercole.io/shared/ercole-rhel8-x86_64.repo | tee /etc/yum.repos.d/ercole-x86_64.repo`
2. `yum install ercole-agent`

### Windows installation
On windows it's required to have powershell >= 2.
1. Download the correct file from [https://repository.ercole.io/win/win/x86_64/](https://repository.ercole.io/win/win/x86_64/).
2. Click to the setup and follow the installation wizard. At the moment the customization of installation directory doesn't work correctly: it must be installed in `C:\ErcoleAgent` (see [issue #186](https://github.com/ercole-io/ercole-agent/issues/186) and [issue #54](https://github.com/ercole-io/ercole-agent/issues/54)). 

### Operating system level differences
|                                       | RHEL5   | RHEL6     | RHEL7     | RHEL8     | Windows      |
|:--------------------------------------|:--------|:----------|:----------|:----------|:-------------|
| Service handling program              | service | systemctl | systemctl | systemctl | services.msc |
| Fetcher alternative user support      | Yes     | Yes       | Yes       | Yes       | No           |
| Powershell required                   | No[1]   | No[1]     | No[1]     | No[1]     | Yes          |
| `Features.OracleDatabase.Oratab` used | Yes     | Yes       | Yes       | Yes       | No           |
| `ForcePwshVersion` property used      | No      | No        | No        | No        | Yes          |
| Virtualization support                | Yes     | Yes       | Yes       | Yes       | No           |
| Oracle/Database support               | Yes     | Yes       | Yes       | Yes       | Yes          |
| Oracle/Exadata support                | Yes     | Yes       | Yes       | Yes       | No           |
| Microsoft/SQLServer support           | No      | No        | No        | No        | Yes          |

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
* `DataserviceURL`: It's the base URL of ercole-dataservice to which are sent the hostdatas.
* `AgentUser`: It's the username used by agent to be authenticated by ercole-dataservice.
* `AgentPassword`: It's the password used by agent to be authenticated by ercole-dataservice.
* `Period`: Is the number of hour between different runs.
* `EnableServerValidation`: True if ercole-agent must validate ercole-dataservice https certificate.
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
##### Oracle/LVM
* Obtain the CA certificate from the oVirt Engine: `openssl s_client -connect olvmmgr:443 -showcerts < /dev/null`
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
The exadata component should not be virtualized.
#### Configuration
* `Features.OracleExadata.Enabled`: true if Oracle/Exadata support should be enabled.
* `Features.OracleExadata.FetcherUser`: name of the user that should be used for fetching the informations. If the value is empty, it's the user that is running the agent. Root permissions are usually required.

### Microsoft/SQLServer target
#### Requirements
* The service user need administration permissions to access to the instances (Trusted connection)
* TCP/IP protocol connections is enabled on the instances
* ercole-agent service need to have a setted user

#### Configuration
* `Features.MicrosoftSQLServer.Enabled`: true if Microsoft/SQLServer support should be enabled.
* `Features.MicrosoftSQLServer.FetcherUser`: name of the user that should be used for fetching the informations. If the value is empty, it's the user that is running the agent. It's useless...

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
* `frequency`: Is the number of hour between different runs.
* `forcestats`: True if the fetcher fetch/*/stats should be run
* `EnableServerValidation`: True if ercole-agent should validate ercole-dataservice https certificate.
* `oratab`: it's the /path/to/the/oratab, the file that contains the list of DBs
* `AWR`: it's the number of Automatic workload repository
* `UseCurl`: true if the agent should use curl to send the hostdata. Otherwise use the internal perl library. On solaris the internal library seems to not work.
* `PrettyPrintHostdata`: if true, the agent will pretty print hostdata json (with right indentation and wrapping lines) before sent.
