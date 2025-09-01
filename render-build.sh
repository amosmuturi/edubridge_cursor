#!/usr/bin/env bash
set -o errexit  # stop on error

# Ensure git + build tools are present
apt-get update && apt-get install -y git

# Upgrade pip first
pip install --upgrade pip setuptools wheel

# Install dependencies
pip install -r requirements.txt
