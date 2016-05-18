FROM ubuntu:trusty


RUN apt-get update
#	&& apt-get install -y --no-install-recommends \
#		ed \
#		less \
#		locales \
#		vim-tiny \
#		wget \
#		ca-certificates \
#	&& rm -rf /var/lib/apt/lists/*


# Install R
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E084DAB9
RUN echo "deb http://cran.r-project.org/bin/linux/ubuntu trusty/" >> /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y r-base r-base-dev

# Install R packages
#RUN echo 'install.packages(c("ggplot2", "plyr", "reshape2", "RColorBrewer", "scales","grid", "wesanderson"), repos="http://cran.us.r-project.org", dependencies=TRUE)' > /tmp/packages.R \
#    && Rscript /tmp/packages.R

# Install node & npm
RUN curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
RUN apt-get install -y nodejs

# Create app directory
RUN mkdir -p /usr/src/app
RUN mkdir -p /usr/src/app/files/123456
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "start" ]
