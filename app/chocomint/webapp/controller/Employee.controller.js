sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "chocomint/utils/constants",
        "chocomint/utils/types/EmailType",
        "chocomint/components/BetterToast",
    ],
    (BaseController, constants, EmailType, BetterToast) => {
        "use strict";
        let router;
        let id;
        return BaseController.extend("chocomint.controller.Employee", {
            onInit() {
                // config routes
                router = this.getOwnerComponent().getRouter();
                // set handler for Detail page
                router
                    .getRoute(constants.EMPLOYEE_INFO)
                    .attachPatternMatched(this._renderDetail, this);
                router.initialize();
                console.log(this.getView().getModel());
            },

            onSubmitForm: function (_) {
                let bValid = true;
                // validate required fields
                this.getView()
                    .byId("FormEmplDetail")
                    .getControlsByFieldGroupId("isRequired")
                    .forEach(function (oControl) {
                        if (oControl.getRequired && oControl.getRequired()) {
                            var sValue = oControl.getValue
                                ? oControl.getValue()
                                : oControl.getSelectedKey();
                            if (!sValue) {
                                oControl.setValueState("Error");
                                oControl.setValueStateText("Required");
                                bValid = false;
                            } else {
                                oControl.setValueState("None");
                                oControl.setValueStateText("");
                            }
                        }
                    });
                if (!bValid) return;

                // get bound context
                const oModel = this.getView().getModel();
                oModel
                    .submitBatch("updateGroup")
                    .then(() => {
                        BetterToast.success("Update Successfully");
                    })
                    .catch(function (err) {
                        BetterToast.error(err.message);
                    });
            },
            onCalculateSalary(e) {
                // bind action
                const model = this.getView().getModel();
                let oAction = this.getView()
                    .getModel()
                    .bindContext("/calSalary(...)");
                // set action parameter
                oAction.setParameter("id", id);

                oAction
                    .invoke()
                    .then(() => {
                        model.refresh();
                        BetterToast.success(
                            "Employee's Salary has been recalculated"
                        );
                    })
                    .catch((err) => {
                        BetterToast.error(err.message);
                    });
            },
            _validateInput: function (oInput) {
                var sValueState = "None";
                var bValidationError = false;
                var oBinding = oInput.getBinding("value");
                try {
                    oBinding.getType().validateValue(oInput.getValue());
                } catch (oException) {
                    sValueState = "Error";
                    bValidationError = true;
                }

                oInput.setValueState(sValueState);

                return bValidationError;
            },
            _renderDetail: async function name(e) {
                id = e.getParameter("arguments").id;
                const form = this.getView().byId("FormEmplDetail");
                const oContext = form
                    .bindElement({
                        path: `/Employees(${id})`,
                        parameters: {
                            $$updateGroupId: "updateGroup",
                            operationMode: "Server",
                            autoExpandSelect: false,
                        },
                        events: {
                            dataReceived: async (e) => {
                                const params = e.getParameters();
                                params.error &&
                                    router.getTargets().display("Target404");
                            },
                        },
                    })
                    .getModel();
                console.log(oContext);
            },
            EmailType,
        });
    }
);
