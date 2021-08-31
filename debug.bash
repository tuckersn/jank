#!/bin/bash
ROOTDIR=$PWD

# Libraries
cd $ROOTDIR/shared
yarn run build &
wait


# Processes 
cd $ROOTDIR/interface
yarn run start &

cd $ROOTDIR/electron
yarn run start &
wait