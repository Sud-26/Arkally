# arkally

start backend service code 
 sudo service supervisor restart
and start server manullay 
 /home/thor/.virtualenvs/thor/bin/uvicorn --log-level trace --workers 2 --http h11 --loop uvloop --host 127.0.0.1 --port 11229 run:nvl_app

backend diretory 
/home/thor/projects/web_backend

#Front end code
/var/www/thor/dist
