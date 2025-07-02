sap.ui.define(
    ["sap/ui/model/SimpleType", "sap/ui/model/ValidateException"],
    (SimpleType, ValidateException) => {
        "use strict";
        return SimpleType.extend("email", {
            formatValue: function (oValue) {
                return oValue;
            },
            parseValue: function (oValue) {
                //parsing step takes place before validating step, value could be altered here
                return oValue;
            },
            validateValue: function (oValue) {
                let rexMail = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
                if (!oValue.match(rexMail)) {
                    throw new ValidateException(
                        "'" + oValue + "' is not a valid e-mail address"
                    );
                }
            },
        });
    }
);
