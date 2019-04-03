#!/bin/bash

echo $PWD
# cd to the node_master and prettify it
cd node_master; npm run prettier;

# cd to the node_slave and prettify it
cd ../node_slave; npm run prettier;


# cd to the node_slave2 and prettify it
cd ../node_slave2; npm run prettier;

