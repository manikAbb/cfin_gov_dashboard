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
        onPressSendForApproval:function(oEvent){
            var oTable = this._oView.byId("idMappingTable"),
                oSelectedItems = oTable.getSelectedItems();
            if(oSelectedItems.length > 0){  
                MessageToast.show(this._oResourceBundle.getText("xmsg.Message2"));
            }else{
                MessageBox.error(this._oResourceBundle.getText("xmsg.Message1"));
            }
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
            //
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
                "Status": pStatus
            };
            BusyIndicator.show(0);
            this._oDataModel.create("/Myrequest_DetSet", oPayload, {
                success: function(oData, oResponse){
                    MessageToast.show(this._oResourceBundle.getText("xmsg.Message3"));
                    this._refreshTable()
                    BusyIndicator.hide();
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