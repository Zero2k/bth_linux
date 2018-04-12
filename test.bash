#!/bin/bash

# Name of the script
SCRIPT=$( basename "$0" )

# Current version
VERSION="1.1.0"

# Message to display for usage and help.

function usage
{
    local txt=(
    ""
    "Utility ./$SCRIPT for doing stuff."
    "Usage: ./$SCRIPT [options] <command> [arguments]"
    ""
    "Command:"
    "  ./test.bash route       cURL server route: '/' - Expected result: 200"
    "  ./test.bash list        cURL server route: '/room/list' - Expected result: 200"
    "  ./test.bash id          cURL server route: '/room/view/id/:id' - Expected result: 200"
    "  ./test.bash house       cURL server route: '/room/view/house/:house' - Expected result: 200"
    "  ./test.bash search      cURL server route: '/room/search/:search' - Expected result: 200"
    "  ./test.bash searchp     cURL server route: '/room/searchp/:search' - Expected result: 200"
    "  ./test.bash all         Executes all the commands"
    ""
    "Options:"
    "  --help, -h     Print help."
    "  --version, -v  Print version."
    "  --verbose      Print more information about the test."
    ""
    )

    printf "%s\n" "${txt[@]}"
}

# Message to display when bad usage.

function badUsage
{
    local message="$1"
    local txt=(
    "For an overview of the command, execute:"
    "$SCRIPT --help, -h"
    )
    #shellcheck disable=SC2059
    [[ $message ]] && printf "$message\n"

    printf "%s\n" "${txt[@]}"
}

# Message to display for version.

function version
{
    local txt=(
    "$SCRIPT version $VERSION"
    )

    printf "%s\n" "${txt[@]}"
}

# Check values for $LINUX_PORT and $LINUX_SERVER

function app-check_values()
{
	printf "%s\n\n" "-------------------------------"

    if [[ $LINUX_PORT ]]; then

        printf "LINUX_PORT already set in 'env': %s\n" "${LINUX_PORT}"

    else

        echo "LINUX_PORT not set!"
        echo "Changing to Default: 1337"
        LINUX_PORT=1337
        export LINUX_PORT
        set LINUX_PORT
        printf "LINUX_PORT in env: %s\n" "${LINUX_PORT}"

    fi;

        printf "\n%s\n\n" "-------------------------------"

    if [[ $LINUX_SERVER ]]; then

        printf "LINUX_SERVER already set in env: %s\n" "${LINUX_SERVER}"

    else

        echo "LINUX_SERVER not set!"
        echo "Changing to Default: localhost"
        LINUX_SERVER=localhost
        export LINUX_SERVER
        set LINUX_SERVER
        printf "LINUX_PORT in env: %s\n" "${LINUX_SERVER}"

    fi;

    printf "\n%s\n" "-------------------------------"
}

#shellcheck disable=SC2086
#shellcheck disable=SC2048
while (( $# ))
do
    case "$1" in

        --help | -h)
            usage
            exit 0
        ;;

        --version | -v)
            version
            exit 0
        ;;

        route \
        | list \
        | id \
        | house \
        | search \
        | searchp )
            app-check_values
            command=$1
            shift
            app-$command $*
            exit 0
        ;;

        *)
            badUsage "Option/command not recognized."
            exit 1
        ;;

    esac
done

badUsage
exit 1
