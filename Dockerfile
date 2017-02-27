FROM node:latest
MAINTAINER linmadan <772181827@qq.com>
COPY ./package.json /home/smartgrid-wechat-portal/
WORKDIR /home/smartgrid-wechat-portal
RUN ["npm","config","set","registry","http://registry.npm.taobao.org"]
RUN ["npm","install","--save","co@4.6.0"]
RUN ["npm","install","--save","kafka-node@1.5.0"]
RUN ["npm","install","--save","rest@2.0.0"]
RUN ["npm","install","--save","pomelo@2.2.5"]
RUN ["npm","install","--save","underscore@1.8.3"]
RUN ["npm","install","--save","gridvo-common-js@0.0.19"]
RUN ["npm","install","pomelo@2.2.5","-g"]
COPY ./lib lib
VOLUME ["/home/smartgrid-wechat-portal"]
ENTRYPOINT ["pomelo"]
CMD ["start","-e","production","-d","./lib/pomelo"]