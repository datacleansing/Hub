FROM google/nodejs

EXPOSE 80

RUN mkdir dmcloud_ui
ADD . dmcloud_ui
RUN cd dmcloud_ui

ENTRYPOINT ["npm", "start"]
