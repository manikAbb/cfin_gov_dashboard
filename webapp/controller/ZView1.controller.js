sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
], (Controller, MessageBox,MessageToast) => {
    "use strict";

    return Controller.extend("cfin.custom.zblocklistgovern.controller.ZView1", {
        onInit() {
            this._oView = this.getView();
            this._oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

        },
        onPressSendForApproval:function(oEvent){
            var oTable = this._oView.byId("idMappingTable"),
                oSelectedItems = oTable.getSelectedItems();
            if(oSelectedItems.length > 0){  
                MessageToast.show(this._oResourceBundle.getText("xmsg.Message2"));
            }else{
                MessageBox.error(this._oResourceBundle.getText("xmsg.Message1"));
            }
        }
    });
});