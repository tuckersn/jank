#!/bin/bash
ROOTDIR=$PWD

# Libraries
cd $ROOTDIR/shared
yarn run build &
wait

# Dependents
cd $ROOTDIR/electron
yarn run build &

cd $ROOTDIR/interface
yarn run build &
wait