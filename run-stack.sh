#!/usr/bin/env bash
#
# @file: run-stack.sh
# @description: monolith (alpha) ide bootstrapper
# @version: 0.8.3
# @author: Loouis Low (loouis@dogsbark.net)
# @copyright: dogsbark Inc (www.dogsbark.net)
#

# imports
source run-stack.conf

### ``variables` provided by environment
# rsa_private, rsa_public
# EMAIL, NAME, USERNAME
# git_url, git_user, git_passwd (some private token)
# git_host, WEBHOOK_URL

check_nodejs() {
  if which node > /dev/null || which n > /dev/null || which npm > /dev/null; then
    return # do nothing
  else
    echo -e "$title installing NodeJS..."
    curl -sS http://deb.nodesource.com/setup_12.x -o /tmp/nodejs-setup.sh
    /bin/bash /tmp/nodejs-setup.sh
    sudo apt update; apt install -y nodejs
    # install node runtime manager
    sudo npm i -g n
  fi
}

check_node_runtime() {
   echo -e "$title swapping runtime to v0.10.33..."
   sudo n 0.10.33
}

update_link() {
  file1="${system}/monolith"
  file2="${system}/monolith-purge"
  # symlink `run-stack`
  if [ -f "$file1" ]; then
    return # do nothing
  else
    echo -e "$title symlinking to '/usr/local/bin/'"
    ln -s ${home}/run-stack.sh ${system}/
    mv ${system}/run-stack.sh ${system}/monolith
    chmod +x ${system}/monolith
  fi
  # symlink `clean-stack`
  if [ -f "$file2" ]; then
    return # do nothing
  else
    echo -e "$title symlinking to '/usr/local/bin/'"
    ln -s ${home}/clean-stack.sh ${system}/
    mv ${system}/clean-stack.sh ${system}/monolith-purge
    chmod +x ${system}/monolith-purge
  fi
}

setup_workspace() {
  echo -e "$title calling 'setup_workspace'..."
  mkdir -p ${workspace}
  mkdir -p ${home}/settings
}

setup_ssh() {
  echo -e "$title calling 'setup_ssh'..."
  if [ ! "$rsa_public" ] || [ ! "$rsa_private" ]; then
    echo -e "$title skipping 'setup_ssh', no private and public keys to setup..."
  fi
  # ensure directory
  mkdir -p ${ssh_dir}
  # store/update keys
  echo "${rsa_public}" | tee "${ssh_dir}id_rsa.pub"
  echo "${rsa_private}" | tee "${ssh_dir}id_rsa"
  chmod 600 "${ssh_dir}id_rsa.pub"
  chmod 600 "${ssh_dir}id_rsa"
}

setup_netrc() {
  echo -e "$title calling 'setup_netrc'..."
  # no valid things to setup
  if [ ! $git_host ] || [ ! $git_user ] || [ ! $git_passwd ]; then
    echo -e "$title skipping 'setup_netrc'..."
    return # do nothing
  fi
  local filename="${home}/.netrc"
  # exit if already there
  if grep -i "machine ${git_host}" $filename; then
    return # do nothing
  fi
  # git auth over http/https with token
  echo "machine ${git_host}
        login ${git_user}
        password ${git_passwd}
       " >> $filename
  chmod 600 $filename
}

setup_git() {
  echo "$title calling 'setup_git'..."
  # skip if git directory exists
  if [ -d "$workspace.git" ]; then
    echo -e "$title skipping 'setup_git' because workspace is already setup..."
      return # do nothing
  fi
  # skip if git url exists
  if [ ! "$git_url" ]; then
    echo -e "$title skipping 'setup_git' because no 'git_url' given..."
    echo -e "$title init empty git repository in workspace..."
    git init ${workspace}
    return # do nothing
  fi
  # cloning
  git clone ${git_url} ${workspace}
}

setup_hg() {
  echo -e "$title calling 'setup_hg'..."
  # skip if git directory exists
  if [ -d "$workspace.hg" ]; then
    echo -e "$title skipping 'setup_hg' because workspace is already setup..."
    return # do nothing
  fi
  # skip if git url exists
  if [ ! "$hg_url" ]; then
    echo -e "$title skipping 'setup_hg' because no 'hg_url' given..."
    echo -e "$title init empty hg repository in workspace..."
    hg init ${workspace}
    return # do nothing
  fi
  # cloning
  hg clone ${hg_url} ${workspace}
}

setup_sample() {
  # sets up a monolith sample if one exists
  cbflags="${cbflags} --sample ${monolithio_stack}"
}

setup_repo() {
  # sets up git or mercurial
  echo -e "$title calling 'setup_repo'..."
  # check if workspace directory already contains stuff
  if [ -n "$(ls -A ${workspace})" ]; then
    echo -e "$title skipping 'setup_repo' because workspace folder is not empty!"
    return # do nothing
  fi
  # check if we should setup either
  # git or mercurial based on env variables provided
  if [ -n "$git_url" ]; then
    setup_git
    return # do nothing
  elif [ -n "$hg_url" ];then
    setup_hg
    return # do nothing
  elif [ -n "$monolithio_stack" ]; then
    setup_sample
  fi
}

setup_perm() {
  echo -e "$title calling 'setup_perm'..."
  #chown ${user} -R ${home}
  chmod +x ${ssh_dir}
  chmod 600 ${ssh_dir}*
  # set /tmp's permissions
  chmod 777 /tmp
}

setup_appengine() {
  # php, python
  if [ -d "/opt/google_appengine" ]; then
    export PATH="/opt/google_appengine:${path}"
  # go
  elif [ -d "/opt/go_appengine" ]; then
    export PATH="/opt/go_appengine:${PATH}"
    export GOROOT="/opt/go_appengine/goroot"
    export GOPATH="/opt/go_appengine/gopath"
  # java
  elif [ -d "/opt/java_appengine" ]; then
    export PATH="/opt/java_appengine/bin:${path}"
  fi
}

setup_env() {
  echo -e "$title calling 'setup_env'..."
  # set home
  export m_user=${USER}
  export workspace_dir=${workspace}
  export workspace_addons_dir="${home}/.monolith-addons/"
  # set command prompt
  export ps1="\[$(tput setaf 1)\]\u\[$(tput setaf 3)\] \W \[$(tput setaf 2)\]# \[$(tput sgr0)\]"
  # set App Engine related variables
  setup_appengine
  # unset sensitive stuff
  unset rsa_private
  unset rsa_public
  unset git_passwd
}

setup_python() {
  echo -e "$title callling 'setup_python'..."
  if [ -f "${python_activate}" ]; then
    source "${python_activate}"
    return # do nothing
  fi
  echo -e "$title skipped 'setup_python'..."
}

start_server() {
  echo -e "$title calling 'start_server'..."
  cd ${workspace}
  exec ${server_script} --hostname ${hostname} --port ${port} --users ${m_users} --title ${projectname} run ${workspace} ${cbflags}
}

###### init ######

banner
#---------
check_nodejs
check_node_runtime
#---------
update_link
#---------
setup_workspace
setup_ssh
setup_netrc
setup_perm
setup_repo
setup_workspace
setup_env
setup_python
start_server

