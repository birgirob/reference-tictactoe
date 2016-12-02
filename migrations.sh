#!/bin/bash

sleep 5
npm run migratedb
exec "$@"
