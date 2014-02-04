ps -ef | grep "node" | awk '{print $2}' | xargs kill
git pull
sh init.sh
mongo sprucedb --eval 'db.dropDatabase();'
grunt test
nohup node server.js
