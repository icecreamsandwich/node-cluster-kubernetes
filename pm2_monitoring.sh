#!/bin/bash
#kill all node processes
killall -9 /usr/bin/node
#killall docker processes
killall -9 /usr/bin/docker-proxy
#kill all mongo processes
killall -9 mongod

# run all mongo instances
mongod --dbpath /data/db --smallfiles --port 27017 --config /etc/mongod.conf &
mongod --dbpath /data/db2 --smallfiles --port 37017 --config /etc/mongod2.conf &
mongod --dbpath /data/db4 --smallfiles --port 47017 --config /etc/mongod4.conf &

#need to be installed pm2 globally `npm install pm2 -g`
pm2 start node_master/index.js;pm2 start node_slave/index.js;pm2 start node_slave2/index.js;
pm2 monit