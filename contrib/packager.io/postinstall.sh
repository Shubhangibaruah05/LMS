#!/bin/bash
#
# packager.io postinstall script
#
PATH=${APP_HOME}/env/bin:${APP_HOME}/:/sbin:/bin:/usr/sbin:/usr/bin:

# import functions
. ${APP_HOME}/contrib/packager.io/functions.sh

# default config
export CONF_DIR=/etc/inventree
export DATA_DIR=${APP_HOME}/data

# define envs
detect_envs

# Setup variables
export SETUP_NGINX_FILE=${SETUP_NGINX_FILE:-/etc/nginx/sites-enabled/inventree.conf}
export SETUP_ADMIN_PASSWORD_FILE=${CONF_DIR}/admin_password.txt
export SETUP_NO_CALLS=${SETUP_NO_CALLS:-false}
# Envs that should be passed to setup commands
export SETUP_ENVS=PATH,APP_HOME,INVENTREE_MEDIA_ROOT,INVENTREE_STATIC_ROOT,INVENTREE_PLUGINS_ENABLED,INVENTREE_PLUGIN_FILE,INVENTREE_CONFIG_FILE,INVENTREE_SECRET_KEY_FILE,INVENTREE_DB_NAME,INVENTREE_DB_ENGINE,INVENTREE_ADMIN_USER,INVENTREE_ADMIN_EMAIL,INVENTREE_ADMIN_PASSWORD

# get base info
detect_docker
detect_initcmd
detect_ip

# create processes
create_initscripts
create_admin

# run updates
stop_inventree
update_or_install
# Write config file
if [ "${SETUP_CONF_LOADED}" = "true" ]; then
  set_env
fi
start_inventree

# show info
final_message
