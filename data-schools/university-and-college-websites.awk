{
	# cat University-and-College-Websites.csv | tr -d \" | awk -F, -f university-and-college-websites.awk | pbcopy
	#print "{name: \"" $1 "\", website: \"" $2 "\", city: \"" $3 "\" state: \"" $4 "\"},"
	print "{name: \"" $1 "\", website: \"" $2 "\", city: \"" $3 "\"},"
}
