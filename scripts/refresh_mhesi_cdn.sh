#!/bin/bash

# Thin wrapper kept for backward compatibility.
# Equivalent to: bash scripts/refresh_cdn.sh mhesi
exec bash "$(dirname "$0")/refresh_cdn.sh" mhesi
