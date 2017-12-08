curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/"'"$SERVICE_ID_BACKEND"'"?action=finishupgrade'

curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
'http://rancher.flowz.com:8080/v2-beta/projects/1a29/services/'+ $SERVICE_ID_FRONTEND +'?action=finishupgrade'
