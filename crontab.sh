#!/bin/sh

tmp_dir=$(mktemp -d -t ci-XXXXXXXXXX)
repository="git@github.com:goldenratio/coolbet-stats.git"

echo $tmp_dir
git clone $repository $tmp_dir

cd $tmp_dir
npm ci

npm run build
npm run deploy

rm -rf $tmp_dir
