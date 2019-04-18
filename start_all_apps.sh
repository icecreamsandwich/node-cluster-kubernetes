#!/bin/bash
#kill all node processes
killall -9 /usr/bin/node
#killall docker processes
killall -9 /usr/bin/docker-proxy
#kill all mongo processes
killall -9 mongod

#cd to the node_master and run the app
cd node_master;	nohup node index.js >> app.log 2>&1 &

#cd to the node_slave and run the app
cd ../node_slave; nohup node index.js >> app.log 2>&1 &

#cd to the node_slave2 and run the app
cd ../node_slave2; nohup node index.js >> app.log 2>&1 &

# run all mongo instances
mongod --dbpath /data/db --smallfiles --port 27017 --config /etc/mongod.conf &
mongod --dbpath /data/db2 --smallfiles --port 37017 --config /etc/mongod2.conf &
mongod --dbpath /data/db4 --smallfiles --port 47017 --config /etc/mongod4.conf &

