# node-cluster-kubernetes
communication between three node applications deployed on docker
# start all apps
To start all the apps at once run `. start_all_apps.sh`
# prettify all code
To prettify all the code run the script `. prettify_all.sh`

# Dockerize all apps
cd to each app (<b>`node_master, node_slave, node_slave2`</b>) directory and run 

`docker build -t <tagname> .`

`docker run -p 5001:5001 -d <tagname>` for node_master.(Give 5002 for node_slave and 5003 for node_slave2)

run `docker inspect bridge` and replace the <server_url> given in the host part of the `node_master/index.js` of each endpoints.

 (eg: `var host = 'http://<server_url>:5003';`) or in the `.env` file.

# API endpoints
#### 1) save data to the db
### POST http://<server_url>:5001/db/save 

eg : `curl -d "name=sudeep vasudevan&address=someaddress&tags='dev','seo','linch'&address_detaills={address2: 'Cheraai',map_location: 'Loc3',pincode: '34545555'}" -H "Content-Type: application/x-www-form-urlencoded" -X POST http://<server_url>:5001/db/save`

#### 2) fetch data from the db
### POST http://<server_url>:5001/db/fetch
eg: `curl -X POST http://<server_url>:5001/db/fetch`

#### 3) update data
### POST http://<server_url>:5001/db/update

eg : `curl -d '{"_id":"5cacbb591b13a424d235e521", "name":"kaitlin"}' -H "Content-Type: application/json" -X POST http://<server_url>:5001/db/update`

#### 4) delete data
### POST http://<server_url>:5001/db/delete 

eg: `curl -d '{"_id":"5cacbb591b13a424d235e521"}' -H "Content-Type: application/json" -X POST http://<server_url>:5001/db/delete`

## PM2 for monitoring

`npm install -g pm2` //install pm2 globally

``pm2 start node_master/index.js``

``pm2 start node_slave/index.js``

``pm2 start node_slave2/index.js``

`pm2 monit` //monitoring in CMD

`pm2 logs` // get the app logs

#### dashboard

`pm2 link bflqdwwaqlf45u2 oqaff6b6af7ardr localhost` // will get the token once the dashboard is connected with github repo

and visit https://app.pm2.io/

### import the db

`cd C:\Program Files\MongoDB\Server\4.0\bin\`

`mongorestore <project_folder>\db\db.json`
