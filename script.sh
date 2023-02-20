#!/bin/bash

# Ejecutar el primer comando y guardar la cookie en /tmp/cookies.txt
curl --cookie-jar /tmp/cookies.txt "https://summa.upsa.es/j_security_check?j_username=talent&j_password=talent_2023"

# Ejecutar el segundo comando y usar la cookie guardada en /tmp/cookies.txt
curl --cookie /tmp/cookies.txt "https://summa.upsa.es/json/select.vm?query=acceptsComments:yes" > ./carpetas.json

# Generar un json con los ids de las carpetas
cat carpetas.json | grep -o '"id":[^,}]*' | cut -d':' -f2 | sed 's/^\|$/"/g' | jq -n '{"ids": [inputs]}' | tr -d '\n' | tr -d ' ' > ./idsCarpetas.json

# Leer el archivo JSON y obtener la lista de IDs
ids=$(jq -r '.ids | flatten | @csv' idsCarpetas.json)
ids=${ids//\"/}
ids=${ids//,/ }

# Crear la consulta con los IDs separados por "%20OR%"
query="parent:(${ids// /%20OR%20})"

# Hacer la consulta con todos los IDs
echo "https://summa.upsa.es/json/select.vm?query=$query&lentgh=2"
curl --cookie /tmp/cookies.txt "https://summa.upsa.es/json/select.vm?query=$query&lentgh=2" > ./fotos.json

# Generar un json con los ids de las fotos
cat fotos.json | grep -o '"id":[^,}]*' | cut -d':' -f2 | sed 's/^\|$/"/g' | jq -n '{"ids": [inputs]}' | tr -d '\n' | tr -d ' ' > ./idsFotos.json