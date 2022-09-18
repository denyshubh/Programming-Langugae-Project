#!/bin/sh

#sets dir to directory containing this script
dir=`dirname $0`

RED="\033[1;31m"
GREEN="\033[1;32m"
NOCOLOR="\033[0m"

#use $dir to access programs in this directory
#so that this script can be run from any directory.

extras=$HOME/cs571/projects/prj1/extras
_file=$1  # reading file input from command line
if [ -n "$_file" ]; then
    echo "Running individual test file"
    if $extras/do-tests.sh ./desig-inits.sh $_file; then
        echo "${GREEN}Passed${NOCOLOR}"
    else
        echo "${RED}Test Failed!${NOCOLOR}"
    fi
else
    echo "running all test files in extras/tests directory"
    if $extras/do-tests.sh ./desig-inits.sh; then
        echo "${GREEN} All Tests Passed${NOCOLOR}"
    else
        echo "${RED}Test Failed!${NOCOLOR}"
    fi
fi





