#!/bin/bash

echo "$1 $2 $3"

if [ -f "$1" ]; then
  echo "Converting"
  /usr/bin/convert "$1" -gravity center -channel RGBA -fill none -fuzz "$3%" -draw "matte 0,0 floodfill" -alpha background -bordercolor none -border "1x1" -draw "matte 0,0 floodfill" -density 300 -quality 100 -trim +repage "$2-token.png"
fi
