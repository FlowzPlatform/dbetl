curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
     "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:"'"$DOCKER_USERNAME"'"/dbetl_backend_flowz:"'"$DOCKER_IMAGE_TAG"'"","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=cluster-flowz"},"ports": ["3034:3034/tcp"],"version": "0","environment": {"RDB_HOST": "'"$RDB_HOST"'","RDB_PORT": "'"$RDB_PORT"'","rauth": "'"$RAUTH"'","cert": "'"$CERT"'"}}},"toServiceStrategy":null}' \
'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/"'"$SERVICE_ID_BACKEND"'"?action=upgrade'

curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
     "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'+ $DOCKER_USERNAME +'/dbetl_frontend_flowz:'+ $DOCKER_IMAGE_TAG +'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=dbetl-front"},"ports": ["80:80/tcp"],"version": "0"}},"toServiceStrategy":null}' \
'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/'+ $SERVICE_ID_FRONTEND +'?action=upgrade'
