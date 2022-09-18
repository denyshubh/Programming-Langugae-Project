#!/bin/sh

RED='\033[0;31m'
GREEN='\033[1;32m'
NC='\033[0m' # No Color

if [ $# -ne 1 -a $# -ne 2 ]
then
   echo "usage: $0 DESIG_INITS_SHELL_SCRIPT [TEST_FILE_PATH]" 
   exit 1
fi

if [ `basename $1` = $1 ]
then
    PROG=./$1
else
    PROG=$1
fi
if [ ! -e $PROG ]
then
    echo "${RED}cannot find $PROG. ${NC}"
    exit 1
fi

testDir=`dirname $0`/tests
outDir="$HOME/tmp"
mkdir -p $outDir

if [ $# -ne 2 ]
then
   cmpTests=$testDir/*.test
   errTests=$testDir/*.err
elif [ `basename $2 .err` != `basename $2` ]
then
    cmpTests=""
    errTests=$2
else
    cmpTests=$2
    errTests=""
fi

for t in $cmpTests
do
    base=`basename $t .test`
    out="$outDir/$base.out"
    gold=$testDir/$base.out
    $PROG < $t | json_pp > $out
    if cmp $gold $out > /dev/null
    then
	echo "`basename $t` $GREEN ok $NC"
	rm $out
    else
	echo "$RED test $t failed:$NC output in $out"
	echo "run 'diff $gold $out' to see differences"
    fi
done

for t in $errTests
do
    $PROG < $t > /dev/null 2>&1
    if [ $? -ne 0 ] 
    then
	echo "`basename $t` $GREEN ok $NC"
    else
	echo "$RED test $t failed:$NC should have exited with failure"
    fi
done

    

