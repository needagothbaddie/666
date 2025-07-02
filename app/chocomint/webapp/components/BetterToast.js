sap.ui.define(["sap/m/MessageToast"], function (MessageToast) {
    "use strict";
    MessageToast.success = function (text) {
        this.show(text);
        $(".sapMMessageToast").addClass("betterToastSucc iconAdded");
    };
    MessageToast.error = function (text) {
        this.show(text);
        $(".sapMMessageToast").addClass("betterToastErr iconAdded");
    };
    return MessageToast;
});
