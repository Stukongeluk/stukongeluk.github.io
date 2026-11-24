#!/bin/bash
set -e

# Clean slate
rm -rf ../docs/* ../docs/.nojekyll

# Build & prerender app, then move static output to ../docs
npx ng build
mv docs/browser/* ../docs
echo jimmynguyen.nl > ../docs/CNAME
touch ../docs/.nojekyll

# Cleanup
rm -rf docs
