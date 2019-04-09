# node-cluster-docker
communication between two node applications deployed on docker
# start all apps
To start all the apps at once run `. start_all_apps.sh`
# prettify all code
To prettify all the code run the script `. prettify_all.sh`

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
