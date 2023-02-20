#!/bin/bash

# Ejecutar el primer comando y guardar la cookie en /tmp/cookies.txt
curl --cookie-jar /tmp/cookies.txt "https://summa.upsa.es/j_security_check?j_username=talent&j_password=talent_2023"

# Ejecutar el segundo comando y usar la cookie guardada en /tmp/cookies.txt
curl --cookie /tmp/cookies.txt "https://summa.upsa.es/json/select.vm?query=acceptsComments:yes" > ./carpetas.json

cat carpetas.json | grep -o '"id":[^,}]*' | cut -d':' -f2 | sed 's/^\|$/"/g' | jq -n '{"ids": [inputs]}' | tr -d '\n' | tr -d ' ' > ./idsCarpetas.json
