#!/bin/bash

set -e

# Download cf command line client
wget -O - https://cli.run.pivotal.io/stable\?release\=linux64-binary\&source\=github | tar xvz -C .

./cf login -a https://api.run.pivotal.io -u $CF_USER -p $CF_PASS

./cf push $1 -c "node app.js" -s cflinuxfs2 --no-manifest
