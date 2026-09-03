#!/bin/bash

# Clean slate
rm ../docs/*
rm ../docs/assets/*
rmdir ../docs/assets

# Build app and move to right dir
ng build
mv docs/browser/* ../docs
echo jimmynguyen.nl > ../docs/CNAME

# Cleanup
rm -rf docs
# done