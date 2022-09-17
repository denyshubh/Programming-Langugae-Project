#!/bin/sh

#sets dir to directory containing this script
dir=`dirname $0`

#use $dir to access programs in this directory
#so that this script can be run from any directory.

/home/ssing163/projects/i571c/extras
echo "no build done"

extras=$HOME/cs571/projects/prj1/extras
# # run a particular test
# $extras/do-tests.sh ./desig-inits.sh $extras/tests/complex.test

# running all tests
echo "running all test cases"
if $extras/do-tests.sh ./desig-inits.sh; then
    echo "All test cases passed successfully!"
else
    echo "Test Failed!"
fi




