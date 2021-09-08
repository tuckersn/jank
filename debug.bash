#!/bin/bash
ROOTDIR=$PWD

# Libraries
cd $ROOTDIR/shared
yarn run build &
wait

install_shared() {
    cd $ROOTDIR/process-manager
    yarn add ../shared/ &
    cd $ROOTDIR/electron
    yarn add ../shared/ &
    cd $ROOTDIR/interface
    yarn add ../shared/ &
    wait
}


# Extensions & Processes
pm_func() {
    cd $ROOTDIR/process-manager
    yarn run build
}


# Processes
interface_func () {
    cd $ROOTDIR/interface
    yarn run start
}
electron_func() {
    cd $ROOTDIR/electron
    yarn run start
}

install_shared

pm_func

interface_func &
electron_func &
wait