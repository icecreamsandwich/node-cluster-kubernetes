#!/bin/bash
#kill all node processes
killall -9 /usr/bin/node

#cd to the node_master and run the app
cd node_master;	nohup node index.js >> app.log 2>&1 &

#cd to the node_slave and run the app
cd ../node_slave; nohup node index.js >> app.log 2>&1 &

#cd to the node_slave2 and run the app
cd ../node_slave2; nohup node index.js >> app.log 2>&1 &

