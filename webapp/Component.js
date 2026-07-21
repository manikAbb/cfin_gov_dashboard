sap.ui.define([
    "sap/ui/core/UIComponent",
    "cfin/custom/zblocklistgovern/model/models",
     "sap/ui/model/json/JSONModel",
], (UIComponent, models,JSONModel) => {
    "use strict";

    return UIComponent.extend("cfin.custom.zblocklistgovern.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");

            // enable routing
             var oViewModel = new JSONModel ({
               aCountReq:"0",
               aCountApprovedReq:"0",
               aCountRejectReq:"0"
            });
            this.setModel(oViewModel, "oMainModel");
            this.getRouter().initialize();
        }
    });
});