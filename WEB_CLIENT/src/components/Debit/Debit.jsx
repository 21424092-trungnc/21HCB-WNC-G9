import React, { PureComponent } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Col,
  Row,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";

// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import {
  configTableOptions,
  configIDRowTable,
  numberFormat,
} from "../../utils/index";
// Model(s)
import DebitModel from "../../models/DebitModel";
// Component(s)

import DebitsFilter from "./DebitFilter";
import CustomPagination from "../../utils/CustomPagination";
import UserModel from "../../models/UserModel";
// Set layout full-wh
layoutFullWidthHeight();

/**
 * @class Debits
 */
class Debit extends PureComponent {
  /**
   * @var {DebitModel}
   */
  _debitModel;

  constructor(props) {
    super(props);

    // Init model(s)
    this._debitModel = new DebitModel();
    this._userModel = new UserModel();
  }
  state = {
    toggleSearch: true,
    page: 0,
    count: 1,
    data: [],
    isLoading: false,
    query: {
      itemsPerPage: 25,
      page: 1,
    },
    openPaid: false,
    debitCancel: null,
    openPayment: false,
    debitPayment: null,
    type: "",
    id: 0,
    rowIndex: 0,
    content: "",
  };

  componentDidMount() {
    this.getData({ ...this.state.query });
  }

  // get data
  getData = (query = {}) => {
    this.setState({ isLoading: true });
    return this._debitModel.list(query).then((res) => {
      let data = [...res.items];
      let isLoading = false;
      let count = res.totalItems;
      let page = query["page"] - 1 || 0;

      this.setState(
        {
          isLoading,
        },
        () => {
          this.setState({
            data,
            count,
            page,
            query,
          });
        }
      );
    });
  };

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  _getBundleData() {
    let bundle = {};
    return bundle;
  }

  handleActionItemClick = (type, id, rowIndex) => {
    if (type.match(/payment/i)) {
      this.handlePayment(id, rowIndex);
    } else {
      this.setState({
        openPaid: true,
        debitCancel: {
          customer_debit_id: id * 1,
          content: "",
        },
        type,
        id,
        rowIndex,
      });
    }
  };
  handleSubmitCancelDebit = (type, id, rowIndex) => {
    window._$g.dialogs.prompt(
      "B???n c?? ch???c ch???n mu???n x??a d??? li???u ??ang ch???n?",
      "X??a",
      (confirm) => this.handleDelete(confirm, id, rowIndex)
    );
  };
  handleClickAdd = () => {
    window._$g.rdr("/debit-remind/add");
  };
  handleDelete = (confirm, id, rowIndex) => {
    const { debitCancel, data, content } = this.state;
    let model = Object.assign({ ...debitCancel }, { content });
    if (confirm) {
      this._debitModel
        .canceldebit(model)
        .then(() => {
          const cloneData = [...data];
          cloneData.splice(rowIndex, 1);
          const count = cloneData.length;
          this.setState({
            data: cloneData,
            count,
            openPaid: false,
          });
        })
        .catch(() => {
          window._$g.dialogs.alert(
            window._$g._("B???n vui l??ng ch???n d??ng d??? li???u c???n thao t??c!")
          );
        });
    }
  };
  handlePayment = (id, rowIndex) => {
    window._$g.dialogs.prompt(
      "B???n c?? ch???c ch???n mu???n thanh to??n n????",
      "C???p nh???t",
      (confirm) => this.onPayment(confirm, id, rowIndex)
    );
  };
  onPayment = (confirm, id, idx) => {
    if (confirm) {
      this.setState({
        openPayment: true,
        debitPayment: {
          customer_debit_id: id * 1,
          opt: "",
        },
        id,
        rowIndex: idx,
      });
      this._debitModel
        .sendOTP(id)
        .then((data) => {})
        .catch(() => {
          window._$g.toastr.show(
            "C???p nh???t tr???ng th??i kh??ng th??nh c??ng.",
            "error"
          );
        });
    }
  };
  handleOTPPayment = () => {
    const { debitPayment, otp, rowIndex, data } = this.state;
    let model = Object.assign({ ...debitPayment }, { otp });
    this._debitModel
      .donedebit(model)
      .then(() => {
        const cloneData = [...data];
        cloneData.splice(rowIndex, 1);
        const count = cloneData.length;
        this.setState({
          data: cloneData,
          count,
          openPayment: false,
        });
      })
      .catch(() => {
        window._$g.dialogs.alert(
          window._$g._("B???n vui l??ng ch???n d??ng d??? li???u c???n thao t??c!")
        );
      });
  };
  handleSubmitFilter = (keyword, created_date_from, created_date_to) => {
    let query = { ...this.state.query };
    query.page = 1;
    query = Object.assign(query, {
      keyword,
      created_date_from,
      created_date_to,
    });
    this.getData(query).catch(() => {
      window._$g.dialogs.alert(
        window._$g._("B???n vui l??ng ch???n d??ng d??? li???u c???n thao t??c!")
      );
    });
  };

  handleChangeRowsPerPage = (event) => {
    let query = { ...this.state.query };
    query.itemsPerPage = event.target.value;
    query.page = 1;
    this.getData(query);
  };

  handleChangePage = (event, newPage) => {
    let query = { ...this.state.query };
    query.page = newPage + 1;
    this.getData(query);
  };

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleChangeOTP = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const columns = [
      configIDRowTable(
        "customer_debit_id",
        "/debit-remind/details/",
        this.state.query
      ),
      {
        name: "account_holder",
        label: "T??n t??i kho???n",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "account_number",
        label: "S??? t??i kho???n",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "current_debit",
        label: "S??? ti???n n???",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return <div className="text-right">{numberFormat(value)}</div>;
          },
        },
      },
      {
        name: "content_debit",
        label: "N???i dung n???",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "status_debit",
        label: "Tr???ng th??i",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "Thao t??c",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            if (this.state.data[tableMeta["rowIndex"]].show_button) {
              return (
                <div className="text-center">
                  <Button
                    color="primary"
                    title="Thanh to??n"
                    className="mr-1"
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "payment",
                        this.state.data[tableMeta["rowIndex"]]
                          .customer_debit_id,
                        tableMeta["rowIndex"]
                      )
                    }
                  >
                    <i className="fa fa-money" />
                  </Button>
                  <Button
                    color="danger"
                    title="X??a"
                    className=""
                    onClick={(evt) =>
                      this.handleActionItemClick(
                        "delete",
                        this.state.data[tableMeta["rowIndex"]]
                          .customer_debit_id,
                        tableMeta["rowIndex"]
                      )
                    }
                  >
                    <i className="fa fa-trash" />
                  </Button>
                </div>
              );
            } else {
              return <></>;
            }
          },
        },
      },
    ];

    const {
      count,
      page,
      query,
      debitCancel,
      openPaid,
      debitPayment,
      openPayment,
      type,
      id,
      rowIndex,
      content,
      otp,
    } = this.state;
    const options = configTableOptions(count, page, query);

    return (
      <div>
        <Card className="animated fadeIn z-index-222 mb-3">
          <CardHeader className="d-flex">
            <div className="flex-fill font-weight-bold">Th??ng tin t??m ki???m</div>
            <div
              className="minimize-icon cur-pointer"
              onClick={() =>
                this.setState((prevState) => ({
                  toggleSearch: !prevState.toggleSearch,
                }))
              }
            >
              <i
                className={`fa ${
                  this.state.toggleSearch ? "fa-minus" : "fa-plus"
                }`}
              />
            </div>
          </CardHeader>
          {this.state.toggleSearch && (
            <CardBody className="px-0 py-0">
              <div className="MuiPaper-filter__custom z-index-2">
                <DebitsFilter
                  userArr={this.state.user}
                  handleSubmit={this.handleSubmitFilter}
                  handleAdd={this.handleClickAdd}
                />
              </div>
            </CardBody>
          )}
        </Card>
        <Button
          className="col-12 max-w-110 mb-3 mobile-reset-width"
          onClick={() => this.handleClickAdd()}
          color="success"
          size="sm"
        >
          <i className="fa fa-plus" />
          <span className="ml-1">Th??m m???i</span>
        </Button>
        <Card className="animated fadeIn">
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-root__custom">
              {this.state.isLoading ? (
                <div className="d-flex flex-fill justify-content-center mt-5 mb-5">
                  <CircularProgress />
                </div>
              ) : (
                <div>
                  <MUIDataTable
                    data={this.state.data}
                    columns={columns}
                    options={options}
                  />
                  <CustomPagination
                    count={count}
                    rowsPerPage={query.itemsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <Dialog
          open={!!openPaid}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="alert-dialog-slide-title">
            <b>X??c nh???n x??a n???</b>
          </DialogTitle>
          <DialogContent>
            {!!debitCancel && (
              <>
                <Row>
                  <Col xs={12}>
                    <FormGroup row>
                      <Label for="content" sm={3}>
                        L?? do h???y
                      </Label>
                      <Col sm={9}>
                        <Input
                          className="MuiPaper-filter__custom--input"
                          autoComplete="nope"
                          type="textarea"
                          name="content"
                          placeholder=" L?? do"
                          value={content || ""}
                          inputprops={{
                            name: "content",
                          }}
                          onChange={this.handleChange}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} className="text-right">
                    <Button
                      key="buttonSave"
                      type="submit"
                      color="primary"
                      onClick={() =>
                        this.handleSubmitCancelDebit(type, id, rowIndex)
                      }
                      className="mr-2 btn-block-sm"
                    >
                      <i className="fa fa-save mr-2" />
                      L??u
                    </Button>
                    <Button
                      onClick={() => {
                        this.setState({
                          openPaid: !openPaid,
                          paidAccountCustomer: {
                            customer_debit_id: "",
                            content: "",
                          },
                        });
                      }}
                      className="btn-block-sm mt-md-0 mt-sm-2"
                    >
                      <i className="fa fa-times-circle mr-1" />
                      ????ng
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </DialogContent>
        </Dialog>
        <Dialog
          open={!!openPayment}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle id="alert-dialog-slide-title">
            <b>X??C NH???N OTP</b>
          </DialogTitle>
          <DialogContent>
            {!!debitPayment && (
              <>
                <Row>
                  <Col xs={12}>
                    <FormGroup row>
                      <Col sm={12}>
                        <Input
                          className="MuiPaper-filter__custom--input"
                          autoComplete="nope"
                          type="text"
                          name="otp"
                          value={otp || ""}
                          inputprops={{
                            name: "otp",
                          }}
                          onChange={this.handleChangeOTP}
                        />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col sm={12} className="text-center">
                    <Button
                      key="buttonSave"
                      type="submit"
                      color="primary"
                      onClick={() => this.handleOTPPayment()}
                      className="mr-2 btn-block-sm"
                    >
                      <i className="fa fa-save mr-2" />
                      X??c nh???n
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

export default Debit;
