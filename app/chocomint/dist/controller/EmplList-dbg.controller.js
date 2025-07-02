sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "chocomint/utils/constants",
        "chocomint/components/BetterToast",
    ],
    (Controller, constants, BetterToast) => {
        "use strict";
        let router;
        return Controller.extend("chocomint.controller.EmplList", {
            onInit() {
                router = this.getOwnerComponent().getRouter();
            },
            onNavDetail(e) {
                const rowData = e
                    .getParameter("row")
                    .getBindingContext()
                    .getObject();
                router.navTo(constants.EMPLOYEE_INFO, { id: rowData.ID });
            },
            onAddEmpl: async function (e) {
                if (!this.oAddDialog) {
                    this.oAddDialog = await this.loadFragment({
                        name: "chocomint.view.fragments.EmplCreate",
                        horizontalScrolling: false,
                        stretch: true,
                    });
                }
                // Create a transient (unsaved) entity
                const oView = this.getView();
                const oModel = oView.getModel();
                // Get the list binding for the Employees entity set
                const oListBinding = oModel.bindList(
                    "/Employees",
                    undefined,
                    undefined,
                    undefined,
                    {
                        $$updateGroupId: "createGroup",
                    }
                );
                const oContext = oListBinding.create({}, true);
                // handler after complete create data
                oListBinding.attachCreateCompleted((res) => {
                    // check if it is success
                    const isSuccess = res.getParameter("success");
                    if (isSuccess) {
                        oView.byId("EmplTable").getBinding("rows").refresh();
                        BetterToast.success("Create successfully!");
                    } else {
                        BetterToast.error("Cannot create new Employee");
                    }
                    this.oAddDialog.close();
                });

                await this.oAddDialog;
                this.oAddDialog.setBindingContext(oContext);
                this.oAddDialog.open();
            },
            onBtnEmplCreate(_) {
                // get bound context
                const oContext = this.oAddDialog.getBindingContext();
                const oModel = oContext.getModel();
                // create
                oModel
                    .submitBatch("createGroup")
                    .then()
                    .catch(function (err) {
                        this.oAddDialog.close();
                        BetterToast.error(err.message);
                    });
            },
            onOnboardEmpl() {
                BetterToast.success("nhu cc");
            },
            onDeleteEmpl(e) {
                // get bound context
                const oContext = e.getParameter("row").getBindingContext();
                const oModel = oContext.getModel();
                // delete
                oContext.delete();
                oModel
                    .submitBatch(oModel.getUpdateGroupId())
                    .then()
                    .catch((err) => {
                        BetterToast.error(err.message);
                    });
                // check if record is deleted
                oContext.isDeleted() &&
                    BetterToast.success("Delete Successfully");
            },
            onBtnClose() {
                this.oAddDialog.close();
            },
        });
    }
);
