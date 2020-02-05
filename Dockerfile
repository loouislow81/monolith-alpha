# //
# Docker container for `monolith-alpha-0.8.3`
# //

FROM ubuntu:16.04

# UNCOMMENT to enable `apt-terraformer`
# use `apt-terraformer` to accelerates containerization
RUN echo 'Acquire::http::proxy "http://172.17.0.1:3142";' > /etc/apt/apt.conf.d/10terraformer

# prerequisites
RUN apt update; apt upgrade --yes
RUN apt install -y sudo nano curl python-pip git net-tools pv make g++ apt-transport-https lsb-release virtualenv software-properties-common python-software-properties openjdk-9-jre

# DISABLE: `apt-terraformer`
# (nodejs hates http)
RUN echo ' ' > /etc/apt/apt.conf.d/10terraformer

RUN curl -sS http://deb.nodesource.com/setup_12.x -o /tmp/nodejs-setup.sh
RUN /bin/bash /tmp/nodejs-setup.sh
RUN apt install -y nodejs
RUN npm i -g n
RUN n 0.10.33

# copy files
RUN mkdir /opt/monolith
COPY file_to_dock.tar.gz /opt/monolith/
RUN tar -zxvf /opt/monolith/file_to_dock.tar.gz -C /opt/monolith/

# clean up
RUN rm /opt/monolith/file_to_dock.tar.gz
RUN apt autoremove -y; apt autoclean -y
RUN rm /var/lib/apt/lists/* 2&>/dev/null

# endpoint
WORKDIR /opt/monolith/
ENTRYPOINT /bin/bash /opt/monolith/run-stack.sh

