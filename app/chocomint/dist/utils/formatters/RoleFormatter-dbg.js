sap.ui.define([], function () {
    "use strict";

    return {
        indicator: (role) => {
            let indicator;
            switch (role) {
                case "Analyst":
                    indicator = "Indication04";
                    break;
                case "Manager":
                    indicator = "Indication05";
                    break;
                case "Developer":
                    indicator = "Indication07";
                    break;
                default:
                    indicator = "Indication02";
            }
            return indicator;
        },
    };
});
