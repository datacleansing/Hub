FROM google/nodejs

EXPOSE 3000

WORKDIR /etc/services/dmcloud_ui
ADD . .
ENTRYPOINT ["npm", "install"]

ENTRYPOINT ["npm", "start"]
