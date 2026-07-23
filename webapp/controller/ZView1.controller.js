sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
], (Controller, MessageBox,MessageToast, BusyIndicator) => {
    "use strict";

    return Controller.extend("cfin.custom.zblocklistgovern.controller.ZView1", {
        onInit() {
            this._oView = this.getView();
            this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            this._oDataModel = this.getOwnerComponent().getModel();
            this._oRouter = this.getOwnerComponent().getRouter();
            this._oRouter.getRoute("RouteZView1").attachPatternMatched(this._onRouteMatched, this);
            this._oMainModel = this.getOwnerComponent().getModel("oMainModel");

        },
        _onRouteMatched:function(){
            console.log("Route Matched");
            this._GetIcnTbBarCount();
        },
        _GetIcnTbBarCount:function(){
            BusyIndicator.show(0);
            this._oDataModel.read("/myrequest_CountSet", {
                success: function(oData, oResponse){
                    if(oData.results.length > 0){
                        this._oMainModel.setProperty("/aCountReq", oData.results[0].PendingReq);
                        this._oMainModel.setProperty("/aCountApprovedReq", oData.results[0].ApprovedReq);
                        this._oMainModel.setProperty("/aCountRejectReq", oData.results[0].RejectedReq);
                    }
                    BusyIndicator.hide();
                }.bind(this),
                error: function(oError){            
                    MessageBox.error(oError.message);
                    BusyIndicator.hide();
                }
            });
        },
        onPressMultiApproval:function(oEvent){
            var oTable = this._oView.byId("idMappingTable"),
                oSelectedItems = oTable.getSelectedItems();
            if(oSelectedItems.length > 0){  
                MessageBox.confirm(this._oResourceBundle.getText("xmsg.Message7"), {
                    onClose: function(oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            this._sendMultipleRequestForApproval(oSelectedItems,"APPROVED");
                        }
                    }.bind(this)
                });
            }else{
                MessageBox.error(this._oResourceBundle.getText("xmsg.Message1"));
            }
        },
        onPressMultiReject:function(oEvent){
            var oTable = this._oView.byId("idMappingTable"),
                oSelectedItems = oTable.getSelectedItems();
            if(oSelectedItems.length > 0){  
                MessageBox.confirm(this._oResourceBundle.getText("xmsg.Message9"), {
                    onClose: function(oAction) {
                        if (oAction === MessageBox.Action.OK) {
                            this._sendMultipleRequestForApproval(oSelectedItems,"REJECTED");
                        }
                    }.bind(this)
                });
            }else{
                MessageBox.error(this._oResourceBundle.getText("xmsg.Message1"));
            }
        },
        _sendMultipleRequestForApproval:function(oSelectedItems, sStatus){ 
             BusyIndicator.show(0);  
            var aArray = [],oPayloadObj={};
            for (var x in oSelectedItems) {
                var oSelectedObj = oSelectedItems[x].getBindingContext().getObject();
                oPayloadObj = {
                    "Approver":oSelectedObj.Approver,
                    "ApprovedOn":oSelectedObj.ApprovedOn,
                    "ApprovedAt":oSelectedObj.ApprovedAt,
                    "Zrule": oSelectedObj.Zrule,
                    "Bukrs": oSelectedObj.Bukrs,
                    "Partner": oSelectedObj.Partner,
                    "ReasonCode": oSelectedObj.ReasonCode,
                    "Vkorg": oSelectedObj.Vkorg,
                    "Vkbur": oSelectedObj.Vkbur,
                    "Prctr": oSelectedObj.Prctr,
                    "Pcgrp": oSelectedObj.Pcgrp,
                    "Spart": oSelectedObj.Spart,
                    "Gsber": oSelectedObj.Gsber,
                    "CreatedOn": oSelectedObj.CreatedOn,
                    "CreatedAt": oSelectedObj.CreatedAt,
                    "ChangedOn": null,
                    "ChangedAt": oSelectedObj.ChangedAt,
                    "ChangedTime":oSelectedObj.ChangedTime,
                    "Status": sStatus 
                }
                aArray.push(oPayloadObj);
            }       
            var oPayload = {
                "Approver":"",
                "ApprovedOn":"",
                "ApprovedAt":"",
                "Approved_Items": aArray
            };
            this._oDataModel.create("/Request_headerSet", oPayload, {
                success: function(oData, oResponse){
                    MessageToast.show(this._oResourceBundle.getText("xmsg.Message3"));
                    this._refreshTable()
                    BusyIndicator.hide();
                    this._GetIcnTbBarCount();
                }.bind(this),
                error: function(oError){
                    MessageBox.error(oError.message);
                    BusyIndicator.hide();
                }.bind(this),
            });
        },
        onPressApprove: function(oEvent){
            var oSelectedItem = oEvent.getSource().getBindingContext().getObject();
            MessageBox.confirm(this._oResourceBundle.getText("xmsg.Message5"), {
                onClose: function(oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        this._onApproveReject(oSelectedItem,"APPROVED");
                    }
                }.bind(this)
            });
        },
        onPressReject: function(oEvent){
            var oSelectedItem = oEvent.getSource().getBindingContext().getObject();
            MessageBox.confirm(this._oResourceBundle.getText("xmsg.Message6"), {
                onClose: function(oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        this._onApproveReject(oSelectedItem,"REJECTED");
                    }
                }.bind(this)
            });
        },
        _onApproveReject:function(oBject, pStatus){
             var oPayload = {
                "Approver":oBject.Approver,
                "ApprovedOn":oBject.ApprovedOn,
                "ApprovedAt":oBject.ApprovedAt,
                "Zrule": oBject.Zrule,
                "Bukrs": oBject.Bukrs,
                "Partner": oBject.Partner,
                "ReasonCode": oBject.ReasonCode,
                "Vkorg": oBject.Vkorg,
                "Vkbur": oBject.Vkbur,
                "Prctr": oBject.Prctr,
                "Pcgrp": oBject.Pcgrp,
                "Spart": oBject.Spart,
                "Gsber": oBject.Gsber,
                "CreatedOn": oBject.CreatedOn,
                "CreatedAt": oBject.CreatedAt,
                "ChangedOn": null,
                "ChangedAt": oBject.ChangedAt,
                "ChangedTime":oBject.ChangedTime,
                "Status": pStatus
            };
            BusyIndicator.show(0);
            this._oDataModel.create("/Myrequest_DetSet", oPayload, {
                success: function(oData, oResponse){
                    MessageToast.show(this._oResourceBundle.getText("xmsg.Message3"));
                    this._refreshTable()
                    BusyIndicator.hide();
                    this._GetIcnTbBarCount();
                }.bind(this),
                error: function(oError){
                    MessageBox.error(oError.message);
                    BusyIndicator.hide();
                }.bind(this),
            });
        },
        _refreshTable:function(){
            this._oView.byId("idMappingSmartTable").rebindTable();
            this._oView.byId("idMappingTable").removeSelections(true);
        }
    });
});