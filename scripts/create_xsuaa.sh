#!/usr/bin/env bash
cf create-service xsuaa application JavaAuth -c xs-security.json &
process_id=$!
wait $process_id
cf create-service-key JavaAuth my-key &
process_id=$!
wait $process_id
cds bind -2 JavaAuth:mykey &
process_id=$!
wait $process_id