#!/usr/bin/env bash
# mvn spring-boot:run -Dspring-boot.run.profiles=cloud

PROFILE=$1

if [ -z "$PROFILE" ]; then
  echo "Usage: $0 {dev|test|prod}"
  mvn cds:watch
  exit 1
fi

case "$PROFILE" in
  cloud)
    mvn spring-boot:run -Dspring-boot.run.profiles=cloud
    ;;
  test)
    echo "Running in TEST mode"
    ;;
  *)
    echo "Unknown profile: $PROFILE"
    echo "Usage: $0 {dev|test|prod}"
    exit 1
    ;;
esac
