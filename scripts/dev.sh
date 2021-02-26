#!/bin/bash


export PORT=3005
npm run webpack
echo $PORT
firefox "http://localhost:$PORT"