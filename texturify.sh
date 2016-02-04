#!/bin/bash

/usr/bin/convert -gravity center -background white -resize '900x900' -density 300 -trim "$1.pdf" -quality 100 -extent '900x900!' "$1.png"

k=0
j=1

if [ -f "$1-$k.png" ]; then
  for i in {1..20}; do
    echo $i
    if [ -f "$1-$j.png" ] && [ "$2" != "true" ]; then
      /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$k.png" -extent '2700x900!' "$1-text$i-part0.png"
      /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$k.png" -extent '900x900!' "$1-temp$i-part0.png"
      /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$k.png" -extent '1800x900!' "$1-temp$i-part1.png"
      /usr/bin/convert -gravity southwest -background white +append "$1-temp$i-part0.png" "$1-temp$i-part1.png" -repage '2700x900!' "$1-text$i-part1.png"
      /usr/bin/convert -gravity southwest -background white -rotate '-180' "$1-$j.png" -extent '900x900!' "$1-temp$i-part2.png"
      /usr/bin/convert -gravity southwest -background white +append "$1-temp$i-part2.png" "$1-temp$i-part2.png" "$1-temp$i-part2.png" -repage '2700x900!' "$1-text$i-part2.png"
      /usr/bin/convert -gravity southwest -background white -append "$1-text$i-part0.png" "$1-text$i-part1.png" "$1-text$i-part2.png" -repage '2700x2700' "$1-text$i.png"
      echo "$1-text$i.png"
    else
      if [ -f "$1-$j.png" ]; then
        /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$k.png" -extent '2700x900!' "$1-text$k-part0.png"
        /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$k.png" -extent '900x900!' "$1-temp$k-part0.png"
        /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$k.png" -extent '1800x900!' "$1-temp$k-part1.png"
        /usr/bin/convert -gravity southwest -background white +append "$1-temp$k-part0.png" "$1-temp$k-part1.png" -repage '2700x900!' "$1-text$k-part1.png"
        /usr/bin/convert -gravity southwest -background white -rotate '-180' "$1-$k.png" -extent '900x900!' "$1-temp$k-part2.png"
        /usr/bin/convert -gravity southwest -background white +append "$1-temp$k-part2.png" "$1-temp$k-part2.png" "$1-temp$k-part2.png" -repage '2700x900!' "$1-text$k-part2.png"
        /usr/bin/convert -gravity southwest -background white -append "$1-text$k-part0.png" "$1-text$k-part1.png" "$1-text$k-part2.png" -repage '2700x2700' "$1-text$k.png"
        echo "$1-text$k.png"
        
        /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$j.png" -extent '2700x900!' "$1-text$j-part0.png"
        /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$j.png" -extent '900x900!' "$1-temp$j-part0.png"
        /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$j.png" -extent '1800x900!' "$1-temp$j-part1.png"
        /usr/bin/convert -gravity southwest -background white +append "$1-temp$j-part0.png" "$1-temp$j-part1.png" -repage '2700x900!' "$1-text$j-part1.png"
        /usr/bin/convert -gravity southwest -background white -rotate '-180' "$1-$j.png" -extent '900x900!' "$1-temp$j-part2.png"
        /usr/bin/convert -gravity southwest -background white +append "$1-temp$j-part2.png" "$1-temp$j-part2.png" "$1-temp$j-part2.png" -repage '2700x900!' "$1-text$j-part2.png"
        /usr/bin/convert -gravity southwest -background white -append "$1-text$j-part0.png" "$1-text$j-part1.png" "$1-text$j-part2.png" -repage '2700x2700' "$1-text$j.png"
        echo "$1-text$j.png"
      else
        if [ -f "$1-$k.png" ]; then
          /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$k.png" -extent '2700x900!' "$1-text$k-part0.png"
          /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$k.png" -extent '900x900!' "$1-temp$k-part0.png"
          /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1-$k.png" -extent '1800x900!' "$1-temp$k-part1.png"
          /usr/bin/convert -gravity southwest -background white +append "$1-temp$k-part0.png" "$1-temp$k-part1.png" -repage '2700x900!' "$1-text$k-part1.png"
          /usr/bin/convert -gravity southwest -background white -rotate '-180' "$1-$k.png" -extent '900x900!' "$1-temp$k-part2.png"
          /usr/bin/convert -gravity southwest -background white +append "$1-temp$k-part2.png" "$1-temp$k-part2.png" "$1-temp$k-part2.png" -repage '2700x900!' "$1-text$k-part2.png"
          /usr/bin/convert -gravity southwest -background white -append "$1-text$k-part0.png" "$1-text$k-part1.png" "$1-text$k-part2.png" -repage '2700x2700' "$1-text$k.png"
          echo "$1-text$k.png"
        else
          if [ -f "$1.png" ]; then
            /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1.png" -extent '2700x900!' "$1-text$k-part0.png"
            /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1.png" -extent '900x900!' "$1-temp$k-part0.png"
            /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1.png" -extent '1800x900!' "$1-temp$k-part1.png"
            /usr/bin/convert -gravity southwest -background white +append "$1-temp$k-part0.png" "$1-temp$k-part1.png" -repage '2700x900!' "$1-text$k-part1.png"
            /usr/bin/convert -gravity southwest -background white -rotate '-180' "$1.png" -extent '900x900!' "$1-temp$k-part2.png"
            /usr/bin/convert -gravity southwest -background white +append "$1-temp$k-part2.png" "$1-temp$k-part2.png" "$1-temp$k-part2.png" -repage '2700x900!' "$1-text$k-part2.png"
            /usr/bin/convert -gravity southwest -background white -append "$1-text$k-part0.png" "$1-text$k-part1.png" "$1-text$k-part2.png" -repage '2700x2700' "$1-text$k.png"
            echo "$1-text$k.png"
          fi
        fi
      fi
    fi
    let "k+=2"
    echo "k is $k"
    let "j+=2"
    echo "j is $j"
  done
else
  /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1.png" -extent '2700x900!' "$1-text$i-part0.png"
  /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1.png" -extent '900x900!' "$1-temp$i-part0.png"
  /usr/bin/convert -gravity southwest -background white -rotate '-90' "$1.png" -extent '1800x900!' "$1-temp$i-part1.png"
  /usr/bin/convert -gravity southwest -background white +append "$1-temp$i-part0.png" "$1-temp$i-part1.png" -repage '2700x900!' "$1-text$i-part1.png"
  /usr/bin/convert -gravity southwest -background white -rotate '-180' "$1.png" -extent '900x900!' "$1-temp$i-part2.png"
  /usr/bin/convert -gravity southwest -background white +append "$1-temp$i-part2.png" "$1-temp$i-part2.png" "$1-temp$i-part2.png" -repage '2700x900!' "$1-text$i-part2.png"
  /usr/bin/convert -gravity southwest -background white -append "$1-text$i-part0.png" "$1-text$i-part1.png" "$1-text$i-part2.png" -repage '2700x2700' "$1-text$i.png"
fi
