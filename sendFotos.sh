#!/bin/bash

# Obtener los IDs del archivo JSON
ids=$(grep -oE "\"[0-9]+\"" idsFotos.json | tr -d "\"")

# Iterar sobre cada ID y hacer la solicitud curl
for id in $ids
do
    curl -X POST -H "Content-Type: image/jpeg" --data-binary @./${id}.jpeg http://localhost:3000/fotos
done