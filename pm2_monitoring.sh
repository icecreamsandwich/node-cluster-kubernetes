#!/bin/bash
#kill all node processes
killall -9 /usr/bin/node
#need to be installed pm2 globally `npm install pm2 -g`
pm2 start node_master/index.js;pm2 start node_slave/index.js;pm2 start node_slave2/index.js;
pm2 monit