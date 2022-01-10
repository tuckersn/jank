#!/bin/bash
ROOTDIR=$PWD

interface_link_func() {
    cd $ROOTDIR/interface
    yarn link
    cd $ROOTDIR/extensions/example-extension
    yarn link jank-interface
}


interface_link_func