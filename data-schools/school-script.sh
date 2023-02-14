#cat schools.json | jq '.schools[].name ' | sort
cat Public_Schools.csv | awk -F, '{print $5}' | sort | uniq | tr [:upper:] [:lower:] | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1' |\
sed -E 's/^/"/;s/$/",/'
#cat Public_Schools.csv | awk -F, '{print$5}' | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1' | sort
#cat Public_Schools.csv | awk -F, '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1' | sort | uniq 
