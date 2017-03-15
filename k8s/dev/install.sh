#!/bin/bash
kubectl -n gridvo get svc | grep -q smartgrid-wechat-portal
if [ "$?" == "1" ];then
	kubectl create -f smartgrid_wechat_portal-service.yaml --record
	kubectl -n gridvo get svc | grep -q smartgrid-wechat-portal
	if [ "$?" == "0" ];then
		echo "smartgrid_wechat_portal-service install success!"
	else
		echo "smartgrid_wechat_portal-service install fail!"
	fi
else
	echo "smartgrid_wechat_portal-service is exist!"
fi
kubectl -n gridvo get pods | grep -q smartgrid-wechat-portal
if [ "$?" == "1" ];then
	kubectl create -f smartgrid_wechat_portal-deployment.yaml --record
	kubectl -n gridvo get pods | grep -q smartgrid-wechat-portal
	if [ "$?" == "0" ];then
		echo "smartgrid_wechat_portal-deployment install success!"
	else
		echo "smartgrid_wechat_portal-deployment install fail!"
	fi
else
	kubectl delete -f smartgrid_wechat_portal-deployment.yaml
	kubectl -n gridvo get pods | grep -q smartgrid-wechat-portal
	while [ "$?" == "0" ]
	do
	kubectl -n gridvo get pods | grep -q smartgrid-wechat-portal
	done
	kubectl create -f smartgrid_wechat_portal-deployment.yaml --record
	kubectl -n gridvo get pods | grep -q smartgrid-wechat-portal
	if [ "$?" == "0" ];then
		echo "smartgrid_wechat_portal-deployment update success!"
	else
		echo "smartgrid_wechat_portal-deployment update fail!"
	fi
fi
