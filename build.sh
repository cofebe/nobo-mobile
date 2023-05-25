#!/bin/bash

ionic cap add ios --save
ionic cap copy ios
ionic cap update

if [ "$1" == "--run" ]; then
	ionic cap run ios -l --extenal
fi
