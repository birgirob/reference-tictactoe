1. Jenkins: http://82.221.49.111:8080/

2. AWS: http://52.210.211.188:3000/


## Scripts

Outline what script files you created and the purpose of each file. Each file should be commented. This could be

- Docker build
setup.sh - Cleans the build, installs node modules, builds the project and the docker image and pushes to Dockerhub.

- Docker compose
No specific script for docker compose

- AWS Provisioning
Just the file uploading defined in the Jenkins Deployment Stage build.

- Other scripts
migrations.sh - Runs the database migrations and runs the remaining arguments (node run from docker compose)

## Testing & logic

Outline what tests you created.

- UnitTests, server logic TDD (Git commit log)
Yes, /server/socket-app/tictactoe-game.spec.js

- API Acceptance test - fluent API
Yes, /apitest/tictactoe.spec.js

- Load test loop
Yes, /apitest/tictactoe.loadtest.js

- UI TDD
No

- Is the game playable?
No

## Data migration

Did you create a data migration.

- Migration up and down
Yes

## Jenkins

Do you have the following Jobs and what happens in each Job:

- Commit Stage
Runs server and client unit tests.
Builds project and docker images and pushes to Dockerhub.

- Acceptance Stage
Performs API and loadtests on AWS

- Deployment Stage
Copies files to the AWS instance, builds and starts the project.


Did you use any of the following features in Jenkins?

- Schedule or commit hooks
Yes, git hook.

- Pipeline
Yes

- Jenkins file
No

- Test reports
Yes

- Other


## Monitoring

Did you do any monitoring?

- URL to monitoring tool. Must be open or include username and pass.
https://p.datadoghq.com/sb/15d84e9a5-f550f92296

## Other

Anything else you did to improve you deployment pipeline of the project itself?