sap.ui.define(
  ["sap/ui/core/UIComponent", "chocomint/model/models"],
  (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("chocomint.Component", {
      metadata: {
        manifest: "json",
        interfaces: ["sap.ui.core.IAsyncContentCreation"],
      },

      async init() {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // set the device model
        this.setModel(models.createDeviceModel(), "device");

        // enable routing
        this.getRouter().initialize();
        // enable xsuaa
        try {
          jQuery.sap.require(
            "sap.ushell.cpv2.services.cloudServices.SiteService"
          );
        } catch (oException) {
          console.log(oException);
        }

        const userModel = await models.createUserModel();
        this.setModel(userModel, "user");
      },
    });
  }
);
