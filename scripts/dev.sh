#!/bin/bash


export PORT=3000
npm run webpack
firefox "http://localhost:$PORT"
exit