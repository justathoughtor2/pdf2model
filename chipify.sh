#!/bin/bash

echo "$1 $2 $3 $4"

if [ -f "$1" ] && [ -f "$2" ] && [ -f "$3" ]; then
  echo "Converting"
  /usr/bin/convert -gravity center -background black -density 300 -trim "$1" -quality 100 -rotate '-180' -resize '690x690^' -crop '690x690+0+0' "$4-top.png"
  /usr/bin/convert -gravity center -background black -density 300 -trim "$2" -quality 100 -resize '690x690^' -crop '690x690+0+0' "$4-bottom.png"
  /usr/bin/convert -gravity center -background black -density 300 -trim "$3" -quality 100 -resize '100x100^' -crop '100x100+0+0' "$4-side.png"
  /usr/bin/montage -gravity center -geometry '+0+0' -trim $(printf "$4-side.png%.0s " {1..160}) -background black -tile "10x16" "$4-tiled.png"
  /usr/bin/convert -gravity center "$4-tiled.png" -resize '1100x690^' -crop '1110x690+0+0' "$4-tilesize.png"
  
  /usr/bin/convert -size "1800x420" -density 300 -quality 100 xc:#000000 "$4-bg.png"
  /usr/bin/convert -gravity southwest -background black -colorspace sRGB +append "$4-top.png" "$4-tilesize.png" -repage "1800x690" "$4-part0.png"
  /usr/bin/convert -gravity southwest -background black -colorspace sRGB +append "$4-bottom.png" "$4-tilesize.png" -repage "1800x690" "$4-part1.png"
  /usr/bin/convert -gravity southwest -background black -colorspace sRGB "$4-part0.png" -resize "1800x690!" "$4-part0.png"
  /usr/bin/convert -gravity southwest -background black -colorspace sRGB "$4-part1.png" -resize "1800x690!" "$4-part1.png"
  /usr/bin/convert -gravity west -background black -colorspace sRGB -append "$4-bg.png" "$4-part0.png" "$4-part1.png" -repage "1800x1800" "$4-chip.png"
fi
