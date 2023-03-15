#!/bin/bash

# Ejecutar el primer comando y guardar la cookie en /tmp/cookies.txt
curl --cookie-jar /tmp/cookies.txt "https://summa.upsa.es/j_security_check?j_username=talent&j_password=talent_2023"

# Ejecutar el segundo comando y usar la cookie guardada en /tmp/cookies.txt
insert=$(cat insert)

curl --cookie /tmp/cookies.txt $insert
