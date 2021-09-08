#!/bin/bash
ROOTDIR=$PWD

# Libraries
cd $ROOTDIR/shared
yarn run build &
wait

# Dependents
cd $ROOTDIR/electron
yarn add ../shared/
yarn run build &

cd $ROOTDIR/interface
yarn run build &
yarn add ../shared/
wait


# Extensions and Processes
cd $ROOTDIR/process-manager
yarn add ../shared/
yarn run build &
wait