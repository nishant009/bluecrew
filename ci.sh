#!/bin/bash

# Example invocation:
# HOST=<> USER=<> PASSWORD=<> DB=bluecrew REDIS_HOST=<> REDIS_PORT=<> LOG_LEVEL=<> ./ci.sh start
start() {
    npm run clean
    npm run dev
    npm run start
}

# Example invocation:
# HOST=<> USER=<> PASSWORD=<> DB=bluecrew REDIS_HOST=<> REDIS_PORT=<> LOG_LEVEL=<> ./ci.sh test
test() {
    npm run test
}

if [ $1 == 'test' ]
then
  test
elif [ $1 == 'start' ]
then
  start
else
  echo "Unknown command"
fi
