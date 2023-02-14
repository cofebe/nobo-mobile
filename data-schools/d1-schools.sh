
#cat division-1-colleges.html | grep -B 5 -e "NCAA D1" > division-1-colleges-filtered.html

#grep --color -o -e "\"https://www.ncsasports.org.*\"" division-1-colleges-filtered.html | xargs -n 1 wget --directory-prefix=d1-schools

#grep --color -m 1 -o -r -e "\"https://recruit-match.ncsasports.org/fasttrack.*.jpg\"" ./d1-schools/

grep --color -h -m 1 -o -r -e "\"https://recruit-match.ncsasports.org/fasttrack.*.jpg\"" ./d1-schools/ > d1-school-image-urls.txt

cat d1-school-image-urls.txt | xargs -n1 wget --directory-prefix=d1-school-images
