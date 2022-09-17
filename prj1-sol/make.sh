#!/bin/sh

#sets dir to directory containing this script
dir=`dirname $0`

#use $dir to access programs in this directory
#so that this script can be run from any directory.

extras=$HOME/cs571/projects/prj1/extras

echo "Run Single Test ... "
node $dir/index.js < $extras/tests/complex.test

echo "running all test cases"
if $extras/do-tests.sh ./desig-inits.sh; then
    echo "All test cases passed successfully!"
else
    echo "Test Failed!"
fi






