ps -ef | grep "node" | awk '{print $2}' | xargs kill
git pull
sh init.sh
mongo sprucedb --eval 'db.dropDatabase();'
grunt test
PORT=8080 nohup node server.js
