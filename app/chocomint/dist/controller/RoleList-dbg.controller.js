sap.ui.define(["sap/ui/core/mvc/Controller"], (BaseController) => {
    "use strict";
    let router;
    return BaseController.extend("chernobyl.controller.Role", {
        onInit() {
            router = this.getOwnerComponent().getRouter();
        },
    });
});
