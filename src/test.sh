#!/bin/bash

curl 'https://thenobo.com/list-my-item/sell' \
  -H 'authority: thenobo.com' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.6' \
  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2M2ZkMTEzMTNiN2M3ZGJhMWY2ODVkMzYiLCJlbWFpbCI6ImpiYWlsZXkrbm9ib0Bjb2ZlYmUuY29tIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNjg2MTc0MDU0LCJyZWZyZXNoIjoxNjg1NTcwMTU0LCJpYXQiOjE2ODU1NjkyNTR9.9iH00AI9Y8Rth_WYrPVt0wudLyJlxqobnAlEHd2ffvE' \
  -H 'cache-control: max-age=0' \
  -H 'content-type: application/json' \
  -H 'dnt: 1' \
  -H 'origin: http://local.softwareninja.org:8050' \
  -H 'referer: http://local.softwareninja.org:8050/' \
  -H 'sec-ch-ua: "Brave";v="113", "Chromium";v="113", "Not-A.Brand";v="24"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'sec-gpc: 1' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36' \
  --data-raw '{
  "attributes":[
    {"id":"color", "value":"Black"},
    {"id":"sizeClothingWomen", "value":"M"},
    {"id":"petiteItem", "value":"No"},
    {"id":"retailTags", "value":"No"},
    {"id":"condition", "value":"New Without Tags"}
  ],
  "images":[
    {"url":"https://thenobo.sfo3.digitaloceanspaces.com/dev/EF6KYi46DMA4PebQxX4Nx.webp", "originalName":"photo.jpg"}
  ],
  "action":"sell",
  "name":"Product 0531.1455",
  "brand":"A-Cold-Wall",
  "description":"",
  "receipt":"",
  "price":400,
  "retailPrice":450,
  "category":"63500f0860f0259ebc06cdaf",
  "parentCategory":"63500f0860f0259ebc06cda6",

  "smokingHome":"",
  "petHome":"",
  "group": "women"
}' \
  --compressed
