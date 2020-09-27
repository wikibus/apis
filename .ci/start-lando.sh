#!/usr/bin/env bash

lando start
npx wait-on --timeout 30000 https://wikibus-sources.lndo.site
