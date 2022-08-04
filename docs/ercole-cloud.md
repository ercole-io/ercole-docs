# Ercole Cloud
Ercole Cloud allows you to retrieve health data about the state of a specific cloud, be it Oracle or AWS.
Thanks to the jobs scheduled within the thunder-service, it is able to retrieve information and suggest possible optimizations to be applied to the external service.

## Minimal default required network/firewall rules
|          From          |         To               |  Port |   Proto   |
|:----------------------:|--------------------------|-------|-----------|
| users                  | ercole-apiservice        | 11113 | HTTP[1]   |
| users                  | ercole-thunderservice    | 11117 | HTTP[1]   |


## Add profiles
In the section dedicated to cloud advisors you can easily add a profile to authenticate yourself to your cloud service, in this way the scheduled job will retrieve the information relating to each `enabled` profile and will create recommendations to be adopted to improve the service.