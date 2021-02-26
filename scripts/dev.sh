#!/bin/bash


export PORT=3005
npm run webpack
firefox "http://localhost:$PORT"
exit