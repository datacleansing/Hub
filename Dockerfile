FROM google/nodejs

EXPOSE 3000

WORKDIR /etc/services/dmcloud_ui
ADD . .
RUN ["npm", "install"]

ENTRYPOINT ["npm", "start"]
