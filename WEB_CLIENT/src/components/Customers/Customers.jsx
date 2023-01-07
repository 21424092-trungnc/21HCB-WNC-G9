import React, { PureComponent } from "react";
import { Card, CardBody, CardHeader, Button } from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)

import CustomerFilter from "./CustomerFilter";

// Util(s)
// import { layoutFullWidthHeight } from '../../utils/html'
import { configTableOptions, configIDRowTable } from "../../utils/index";
// Model(s)
import CustomerModel from "../../models/CustomerModel";

// Set layout full-wh
// layoutFullWidthHeight()

/**
 * @class Customers
 */
class Customers extends PureComponent {
  /**
   * @var {CustomerModel}
   */
  _userModel;

  constructor(props) {
    super(props);

    // Init model(s)
    this._userModel = new CustomerModel();
    // Bind method(s)
  }

  state = {
    toggleSearch: true,
    page: 0,
    count: 1,
    data: [],
    query: {
      itemsPerPage: 25,
      page: 1,
    },
    isLoading: false,
    isOpenSnackbar: false,
    snackbarMsg: "",
    snackBarClss: "info",
    /** @var {Array} */
    roles: [
      { name: "Role 1", value: "1" },
      { name: "Role 2", value: "2" },
      { name: "Role 3", value: "3" },
      { name: "Role 4", value: "4" },
    ],
  };

  componentDidMount() {
    // Get bundle data
    this.setState({ isLoading: true });
    (async () => {
      let bundle = await this._getBundleData();
      let { data = {} } = bundle;
      let dataConfig = data.items || [];
      let isLoading = false;
      let count = data.totalItems;
      let page = 0;
      //
      this.setState(
        {
          isLoading,
        },
        () => {
          this.setState({
            data: dataConfig,
            count,
            page,
          });
        }
      );
    })();
    //.end
  }

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    let bundle = {};
    let all = [
      // @TODO:
      this._userModel.list().then((data) => (bundle["data"] = data)),
    ];
    await Promise.all(all).catch((err) => {
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => {
          window.location.reload();
        }
      );
    });
    // console.log('bundle: ', bundle);
    return bundle;
  }

  // get data
  getData = (query = {}) => {
    this.setState({ isLoading: true });
    return this._userModel.list(query).then((res) => {
      let data = res.items;
      let isLoading = false;
      let count = res.totalItems;
      let page = query["page"] - 1 || 0;
      this.setState({
        data,
        isLoading,
        count,
        page,
        query,
      });
    });
  };

  handleActionItemClick(type, id, rowIndex) {
    let routes = {
      detail: "/customers/detail/",
      delete: "/customers/delete/",
      edit: "/customers/edit/",
      changePassword: "/customers/change-password/",
    };
    const route = routes[type];
    if (type.match(/detail|edit|changePassword/i)) {
      window._$g.rdr(`${route}${id}`);
    } else {
      window._$g.dialogs.prompt(
        "Bạn có chắc chắn muốn xóa dữ liệu đang chọn?",
        "Xóa",
        (confirm) => this.handleClose(confirm, id, rowIndex)
      );
    }
  }

  handleClose(confirm, id, rowIndex) {
    const { data } = this.state;
    if (confirm) {
      this._userModel
        .delete(id)
        .then(() => {
          const cloneData = JSON.parse(JSON.stringify(data));
          cloneData.splice(rowIndex, 1);
          this.setState({
            data: cloneData,
          });
        })
        .catch(() => {
          window._$g.dialogs.alert(
            window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
          );
        });
    }
  }

  handleSubmitFilter = (search) => {
    let query = { ...this.state.query };
    query.page = 1;
    query = Object.assign(query, { search });
    this.getData(query).catch(() => {
      window._$g.dialogs.alert(
        window._$g._("Bạn vui lòng chọn dòng dữ liệu cần thao tác!")
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

  render() {
    const columns = [
      configIDRowTable("user_id", "/customers/detail/", this.state.query),
      {
        name: "user_name",
        label: "Tên tài khoản",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "full_name",
        label: "Họ và tên",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "gender",
        label: "Giới tính",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            let result = null;
            switch ("" + value) {
              case "0":
                result = <span>Nữ</span>;
                break;
              case "1":
                result = <span>Nam</span>;
                break;
              default:
                result = <span>Khác</span>;
            }
            return result;
          },
        },
      },
      {
        name: "phone_number",
        label: "Điện thoại",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "address",
        label: "Địa chỉ",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "email",
        label: "Email",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "Thao tác",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="text-center">
                <Button
                  color="warning"
                  title="Lịch sử giao dịch"
                  className="mr-1"
                  onClick={(evt) =>
                    this.handleActionItemClick(
                      "detail",
                      this.state.data[tableMeta["rowIndex"]].user_id,
                      tableMeta["rowIndex"]
                    )
                  }
                >
                  <i className="fa fa-history" />
                </Button>
                <Button
                  color="primary"
                  title="Thêm tài khoản"
                  className="mr-1"
                  onClick={(evt) =>
                    this.handleActionItemClick(
                      "edit",
                      this.state.data[tableMeta["rowIndex"]].user_id,
                      tableMeta["rowIndex"]
                    )
                  }
                >
                  <i className="fa fa-plus" />
                </Button>
                <Button
                  color="success"
                  title="Nạp tiền"
                  className="mr-1"
                  onClick={(evt) =>
                    this.handleActionItemClick(
                      "edit",
                      this.state.data[tableMeta["rowIndex"]].user_id,
                      tableMeta["rowIndex"]
                    )
                  }
                >
                  <i className="fa fa-money" />
                </Button>

              </div>
            );
          },
        },
      },
    ];

    const { count, page, query } = this.state;
    const options = configTableOptions(count, page, query);

    return (
      <div>
        <Card className="animated fadeIn z-index-222 mb-3">
          <CardHeader className="d-flex">
            <div className="flex-fill font-weight-bold">Thông tin tìm kiếm</div>
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
                <CustomerFilter handleSubmit={this.handleSubmitFilter} />
              </div>
            </CardBody>
          )}
        </Card>
        <Card className="animated fadeIn">
          <CardBody className="px-0 py-0">
            <div className="MuiPaper-root__custom MuiPaper-user">
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
      </div>
    );
  }
}

export default Customers;
