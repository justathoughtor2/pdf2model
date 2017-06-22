#!/bin/bash

echo "$1 $2 $3"

if [ -f "$1" ]; then
  echo "Converting"
  density=$(/usr/bin/identify -format "%x" "$1")
  width=$(/usr/bin/identify -format "%w" "$1")
  height=$(/usr/bin/identify -format "%h" "$1")
  topleft=$(/usr/bin/identify -format "%[pixel:1x1]" "$1")
  topright=$(/usr/bin/identify -format "%[pixel:$width""x1]")
  bottomleft=$(/usr/bin/identify -format "%[pixel:1x$height]")
  bottomright=$(/usr/bin/identify -format "%[pixel:$width""x$height]")
  
  /usr/bin/convert -debug all "$1" -fuzz "$3%" -transparent "$topleft" -transparent "$topright" -transparent "$bottomright" -transparent "$bottomleft" -density "$density" -trim -resize "2073600@>" +repage "$2-token.png"
fi
