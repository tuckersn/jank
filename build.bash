#!/bin/bash
ROOTDIR=$PWD

# Libraries
cd ../shared
yarn run build &
wait

# Dependents
cd ./electron
yarn run build &

cd ../interface
yarn run build &
wait