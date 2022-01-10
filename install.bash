#!/bin/bash
ROOTDIR=$PWD

install_shared() {
    cd $ROOTDIR/process-manager
    yarn add ../shared/ &
    cd $ROOTDIR/electron
    yarn add ../shared/ &
    cd $ROOTDIR/interface
    yarn add ../shared/ &
    wait
}

install_shared