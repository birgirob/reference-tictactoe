#!/bin/bash

# Get node environment (production/development) from first argument
node_env=$1
# Shift the arguments by 1 to execute the rest later
shift 1

echo Node environment: $node_env

# Sleep to make sure the database is up
# And execute the database migrations
sleep 5
npm run migratedb:$node_env

# Execute the rest of the arguments
exec "$@"
