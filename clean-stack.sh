#!/usr/bin/env bash
#
# @file: clean-stack.sh
# @description: monolith (alpha) delete user stack data
# @version: 0.8.3
# @author: Loouis Low (loouis@dogsbark.net)
# @copyright: dogsbark Inc (www.dogsbark.net)
#

# imports
source run-stack.conf

delete_data() {
  echo -e "$title deleting user stack data..."
  rm -rfv ${dir_1} ${dir_2} ${dir_3} ${dir_4} ${dir_5}
  rm -rfv ${file_1}
  echo -e "$title cleaned up!"
} 

###### init ######

delete_data

