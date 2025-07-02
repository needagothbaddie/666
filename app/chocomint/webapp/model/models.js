sap.ui.define(
    ["sap/ui/model/json/JSONModel", "sap/ui/Device"],
    function (JSONModel, Device) {
        "use strict";

        return {
            /**
             * Provides runtime information for the device the UI5 app is running on as a JSONModel.
             * @returns {sap.ui.model.json.JSONModel} The device model.
             */
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            async createUserModel() {
                // bind action
                const oModel = new sap.ui.model.odata.v4.ODataModel({
                    serviceUrl: "/odata/v4/MyService/",
                    synchronizationMode: "None",
                    operationMode: "Server",
                });
                // get current user
                let oAction = oModel.bindContext("/whoami(...)");
                let isAdmin;
                await oAction
                    .invoke()

                    .catch((err) => {
                        console.log(err);
                    });
                const oResult = oAction.getBoundContext().getObject();
                isAdmin = oResult.role.find("AdminJava");
                return new JSONModel({ isAdmin });
            },
        };
    }
);
