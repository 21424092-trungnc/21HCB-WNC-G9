import React, { PureComponent } from "react";
import { Card, CardBody, CardHeader, Button } from "reactstrap";

// Material
import MUIDataTable from "mui-datatables";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { CircularProgress } from "@material-ui/core";
import CustomPagination from "../../utils/CustomPagination";

// Component(s)

import MenuFilter from "./MenuFilter";
// Util(s)
import { layoutFullWidthHeight } from "../../utils/html";
import { configTableOptions, configIDRowTable } from "../../utils/index";
// Model(s)
import MenuModel from "../../models/MenuModel";

/** @var {Object} */
const userAuth = window._$g.userAuth;

// Set layout full-wh
layoutFullWidthHeight();
const StatusType = {
  STATUS: "STATUS",
};
/**
 * @class Menus
 */
class Menus extends PureComponent {
  /**
   * @var {MenuModel}
   */
  _menuModel;

  constructor(props) {
    super(props);

    // Init model(s)
    this._menuModel = new MenuModel();
  }
  state = {
    toggleSearch: true,
    page: 0,
    count: 1,
    data: [],
    isLoading: false,
    query: {
      itemsPerPage: 100, // @TODO: get all records
      page: 1,
      is_active: 1,
      _format: {
        recursive: true,
      },
    },
  };

  componentDidMount() {
    this.getData({ ...this.state.query });
  }

  // get data
  getData = (query = {}) => {
    this.setState({ isLoading: true });
    return this._menuModel.list(query).then((res) => {
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

  handleClickAdd = () => {
    window._$g.rdr("/menus/add");
  };

  handleActionItemClick = (type, id, rowIndex) => {
    let routes = {
      detail: "/menus/details/",
      delete: "/menus/delete/",
      edit: "/menus/edit/",
    };
    const route = routes[type];
    if (type.match(/detail|edit/i)) {
      window._$g.rdr(`${route}${id}`);
    } else {
      window._$g.dialogs.prompt(
        "B???n c?? ch???c ch???n mu???n x??a d??? li???u ??ang ch???n?",
        "X??a",
        (confirm) => this.handleDelete(confirm, id, rowIndex)
      );
    }
  };

  handleDelete = (confirm, id, rowIndex) => {
    const { data } = this.state;
    if (confirm) {
      this._menuModel
        .delete(id)
        .then(() => {
          const cloneData = [...data];
          cloneData.splice(rowIndex, 1);
          const count = cloneData.length;
          this.setState({
            data: cloneData,
            count,
          });
        })
        .catch(() => {
          window._$g.dialogs.alert(
            window._$g._("B???n vui l??ng ch???n d??ng d??? li???u c???n thao t??c!")
          );
        });
    }
  };

  handleChangeStatus = (status, id, rowIndex, type = StatusType.STATUS) => {
    window._$g.dialogs.prompt(
      "B???n c?? ch???c ch???n mu???n thay ?????i tr???ng th??i d??? li???u ??ang ch???n?",
      "C???p nh???t",
      (confirm) => this.onChangeStatus(confirm, status, id, rowIndex, type)
    );
  };

  onChangeStatus = (confirm, status, id, idx, type) => {
    if (confirm) {
      let postData;
      switch (type) {
        default:
          postData = { is_active: status ? 1 : 0 };
          this._menuModel
            .changeStatus(id, postData)
            .then(() => {
              const cloneData = [...this.state.data];
              cloneData[idx].is_active = status;
              this.setState(
                {
                  data: cloneData,
                },
                () => {
                  window._$g.toastr.show(
                    "C???p nh???t tr???ng th??i th??nh c??ng.",
                    "success"
                  );
                }
              );
            })
            .catch(() => {
              window._$g.toastr.show(
                "C???p nh???t tr???ng th??i kh??ng th??nh c??ng.",
                "error"
              );
            });
          break;
      }
    }
  };

  handleSubmitFilter = (search, function_id, selectedOption) => {
    let query = { ...this.state.query };
    let is_active = selectedOption;
    console.log("is_active:" + is_active);
    query = Object.assign(query, {
      search,
      function_id,
      is_active,
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

  render() {
    const columns = [
      configIDRowTable("menu_id", "/menus/details/", this.state.query),
      {
        name: "icon_path",
        label: "Icon",
        options: {
          filter: false,
          sort: true,
          customBodyRender: (value) => {
            return value ? (
              <span>
                <i className={value}></i> <small>({value})</small>
              </span>
            ) : null;
          },
        },
      },
      {
        name: "menu_name",
        label: "T??n menu",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        name: "function_name",
        label: "Quy???n",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        name: "link_menu",
        label: "Link",
        options: {
          filter: false,
          sort: true,
        },
      },
      {
        name: "description",
        label: "M?? t???",
        options: {
          filter: false,
          sort: false,
        },
      },
      {
        name: "order_index",
        label: "Th??? t???",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            return <span className="d-block text-right">{value || 0}</span>;
          },
        },
      },
      {
        name: "is_active",
        label: "K??ch ho???t",
        options: {
          filter: true,
          customHeadRender: (columnMeta, handleToggleColumn) => {
            return (
              <th
                key={`head-th-${columnMeta.label}`}
                className="MuiTableCell-root MuiTableCell-head"
              >
                <div className="text-center">{columnMeta.label}</div>
              </th>
            );
          },
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="text-center">
                <FormControlLabel
                  label={value ? "C??" : "Kh??ng"}
                  value={value ? "C??" : "Kh??ng"}
                  control={
                    <Switch
                      color="primary"
                      checked={value === 1}
                      value={value}
                    />
                  }
                  onChange={(event) => {
                    let checked = 1 * event.target.value === 1 ? 0 : 1;
                    this.handleChangeStatus(
                      checked,
                      this.state.data[tableMeta["rowIndex"]].menu_id,
                      tableMeta["rowIndex"]
                    );
                  }}
                  disabled={userAuth._isAdministrator()}
                />
              </div>
            );
          },
        },
      },
      {
        name: "Thao t??c",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div className="text-center">
                <Button
                  color="warning"
                  title="Chi ti???t"
                  className="mr-1"
                  onClick={(evt) =>
                    this.handleActionItemClick(
                      "detail",
                      this.state.data[tableMeta["rowIndex"]].menu_id,
                      tableMeta["rowIndex"]
                    )
                  }
                >
                  <i className="fa fa-info" />
                </Button>
                <Button
                  color="success"
                  title="Ch???nh s???a"
                  className="mr-1"
                  onClick={(evt) =>
                    this.handleActionItemClick(
                      "edit",
                      this.state.data[tableMeta["rowIndex"]].menu_id,
                      tableMeta["rowIndex"]
                    )
                  }
                  disabled={userAuth._isAdministrator()}
                >
                  <i className="fa fa-edit" />
                </Button>
                <Button
                  color="danger"
                  title="X??a"
                  className=""
                  onClick={(evt) =>
                    this.handleActionItemClick(
                      "delete",
                      this.state.data[tableMeta["rowIndex"]].menu_id,
                      tableMeta["rowIndex"]
                    )
                  }
                  disabled={userAuth._isAdministrator()}
                >
                  <i className="fa fa-trash" />
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
        <Card className="animated fadeIn z-index-222">
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
                <MenuFilter handleSubmit={this.handleSubmitFilter} />
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
      </div>
    );
  }
}

export default Menus;
