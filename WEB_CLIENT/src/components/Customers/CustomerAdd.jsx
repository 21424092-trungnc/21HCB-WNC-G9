import React, { PureComponent } from "react";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import moment from "moment";

// Component(s)

import Loading from "../Common/Loading";
import DatePicker from "../Common/DatePicker";

// Model(s)
import CustomerModel from "../../models/CustomerModel";

/**
 * @class CustomerAdd
 */
export default class CustomerAdd extends PureComponent {
  /** @var {Object} */
  formikProps = null;

  constructor(props) {
    super(props);

    // Init model(s)
    this._customerModel = new CustomerModel();

    // Bind method(s)
    this.handleFormikBeforeRender = this.handleFormikBeforeRender.bind(this);
    this.handleFormikSubmit = this.handleFormikSubmit.bind(this);
    this.handleFormikReset = this.handleFormikReset.bind(this);

    // Init state
    // +++
    let { customerEnt } = props;
    // let {} = customerEnt || {};
    // +++
    this.state = {
      /** @var {Number} */
      _id: 0,
      /** @var {Array} */
      alerts: [],
      /** @var {Boolean} */
      ready: false,
      /** @var {Object|null} */
      customerData: null,
      /** @var {Array} */
      genders: [
        { name: "Nam", id: "1" },
        { name: "Nữ", id: "0" },
      ],
    };

    // Init validator
    this.formikValidationSchema = Yup.object().shape({
      user_name: Yup.string().trim().required("Tên đăng nhập là bắt buộc."),
      password: customerEnt
        ? undefined
        : Yup.string()
            .trim()
            .min(8, "Mật khẩu quá ngắn, ít nhất 8 ký tự!")
            .max(25, "Mật khẩu quá dài, tối đa 25 ký tự!")
            .required("Mật khẩu là bắt buộc."),
      gender: Yup.string().required("Giới tính là bắt buộc."),
      email: Yup.string()
        .trim()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc."),
      birthday: Yup.string().trim().required("Ngày sinh là bắt buộc."),
      first_name: Yup.string().trim().required("Họ là bắt buộc."),
      last_name: Yup.string().trim().required("Tên là bắt buộc."),
      address: Yup.string().trim().required("Địa chỉ là bắt buộc."),
      phone_number: Yup.string()
        .trim()
        .matches(/^\d{10,11}$/, "Điện thoại không hợp lệ!")
        .required("Điện thoại là bắt buộc."),
    });
  }

  componentDidMount() {
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    //.end
  }

  /**
   *
   * @return {Object}
   */
  getInitialValues() {
    let { customerEnt } = this.props;
    let { customerData = {} } = this.state;
    let values = Object.assign(
      {},
      this._customerModel.fillable(),
      customerData
    );
    if (customerEnt) {
      Object.assign(values, customerEnt);
    }
    // Format
    Object.keys(values).forEach((key) => {
      if (null === values[key]) {
        values[key] = "";
      }
      if (key === "birthday") {
        let bdArr = values[key].match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
        bdArr && (values[key] = `${bdArr[3]}-${bdArr[2]}-${bdArr[1]}`);
      }
      // customer_groups
      if (key === "customer_groups") {
        values[key] = values[key] || [];
      }
    });

    // Return;
    return values;
  }

  /**
   * Goi API, lay toan bo data lien quan, vd: chuc vu, phong ban, dia chi,...
   */
  async _getBundleData() {
    // let { customerEnt } = this.props;
    let bundle = {};
    let all = [];
    await Promise.all(all).catch((err) =>
      window._$g.dialogs.alert(
        window._$g._(`Khởi tạo dữ liệu không thành công (${err.message}).`),
        () => window.location.reload()
      )
    );
    //
    Object.keys(bundle).forEach((key) => {
      let data = bundle[key];
      let stateValue = this.state[key];
      if (data instanceof Array && stateValue instanceof Array) {
        data = [stateValue[0]].concat(data);
      }
      bundle[key] = data;
    });
    // console.log('bundle: ', bundle);
    //
    return bundle;
  }

  handleFormikBeforeRender({ initialValues }) {
    let { values } = this.formikProps;
    if (values === initialValues) {
      return;
    }
    // +++
    Object.assign(values, {});
    // console.log('formikBfRender: ', values);
  }

  /** @var {String} */
  _btnType = null;

  handleSubmit(btnType) {
    let { submitForm } = this.formikProps;
    this._btnType = btnType;
    window.scrollTo(0, 0);
    return submitForm();
  }

  handleFormikSubmit(values, formProps) {
    let { customerEnt } = this.props;
    let { setSubmitting } = formProps;
    let willRedirect = false;
    let alerts = [];
    // Build form data
    // +++
    let { birthday } = values;
    let bdArr = (birthday && moment(birthday).format("DD/MM/YYYY")) || [];
    // +++
    let formData = Object.assign({}, values, {
      birthday: bdArr.length ? bdArr : "",
      phone_number: "" + values.phone_number,
      password_confirm: values.password,
    });
    let customerId =
      (customerEnt && customerEnt.id()) || formData[this._customerModel];
    let apiCall = customerId
      ? this._customerModel.update(customerId, formData)
      : this._customerModel.create(formData);
    apiCall
      .then((data) => {
        // OK
        window._$g.toastr.show("Lưu thành công!", "success");
        if (this._btnType === "save_n_close") {
          willRedirect = true;
          return window._$g.rdr("/customers");
        }
        // Chain
        return data;
      })
      .catch((apiData) => {
        // NG
        let { errors, statusText, message } = apiData;
        let msg = [`<b>${statusText || message}</b>`]
          .concat(errors || [])
          .join("<br/>");
        alerts.push({ color: "danger", msg });
      })
      .finally(() => {
        // Submit form is done!
        setSubmitting(false);
        //
        if (!customerEnt && !willRedirect && !alerts.length) {
          return this.handleFormikReset();
        }
        this.setState(
          () => ({ alerts }),
          () => {
            window.scrollTo(0, 0);
          }
        );
      });
  }

  handleFormikReset() {
    this.setState((state) => ({
      _id: 1 + state._id,
      ready: false,
      alerts: [],
    }));
    // Get bundle data --> ready data
    (async () => {
      let bundle = await this._getBundleData();
      this.setState({ ...bundle, ready: true });
    })();
    //.end
  }

  render() {
    let { _id, ready, alerts, genders } = this.state;
    let { customerEnt, noEdit } = this.props;
    /** @var {Object} */
    let initialValues = this.getInitialValues();
    // Ready?
    if (!ready) {
      return <Loading />;
    }

    return (
      <div key={`view-${_id}`} className="animated fadeIn">
        <Row>
          <Col xs={12}>
            <Card>
              <CardHeader>
                <b>
                  {customerEnt
                    ? noEdit
                      ? "Chi tiết"
                      : "Chỉnh sửa"
                    : "Thêm mới"}{" "}
                  khách hàng {customerEnt ? customerEnt.full_name : ""}
                </b>
              </CardHeader>
              <CardBody>
                {/* general alerts */}
                {alerts.map(({ color, msg }, idx) => {
                  return (
                    <Alert
                      key={`alert-${idx}`}
                      color={color}
                      isOpen={true}
                      toggle={() => this.setState({ alerts: [] })}
                    >
                      <span
                        dangerouslySetInnerHTML={{ __html: msg.toString() }}
                      />
                    </Alert>
                  );
                })}
                <Formik
                  initialValues={initialValues}
                  validationSchema={this.formikValidationSchema}
                  onSubmit={this.handleFormikSubmit}
                >
                  {(formikProps) => {
                    let { values, handleSubmit, handleReset, isSubmitting } =
                      (this.formikProps = formikProps);
                    // [Event]
                    this.handleFormikBeforeRender({ initialValues });
                    // Render
                    return (
                      <Form
                        id="form1st"
                        onSubmit={handleSubmit}
                        onReset={handleReset}
                      >
                        <Row>
                          <Col xs={12} sm={12}>
                            <Row>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="user_name" sm={4}>
                                    Tên đăng nhập
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="user_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="user_name"
                                          id="user_name"
                                          placeholder="cus.0001"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="user_name"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={12} sm={6}>
                                <FormGroup
                                  row
                                  hidden={!!customerEnt}
                                  className={`${customerEnt ? "hidden" : ""}`}
                                >
                                  <Label for="Password" sm={4}>
                                    Mật khẩu
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <InputGroup>
                                      <Field
                                        name="password"
                                        render={({ field /* _form */ }) => (
                                          <Input
                                            {...field}
                                            onBlur={null}
                                            type={`${
                                              this.state.passwordVisible
                                                ? "text"
                                                : "password"
                                            }`}
                                            name="password"
                                            id="password"
                                            placeholder="******"
                                            disabled={noEdit}
                                          />
                                        )}
                                      />
                                      <InputGroupAddon addonType="append">
                                        <Button
                                          block
                                          onClick={() => {
                                            let { passwordVisible } =
                                              this.state;
                                            this.setState({
                                              passwordVisible: !passwordVisible,
                                            });
                                          }}
                                        >
                                          <i
                                            className={`fa ${
                                              this.state.passwordVisible
                                                ? "fa-eye-slash"
                                                : "fa-eye"
                                            }`}
                                          />
                                        </Button>
                                      </InputGroupAddon>
                                    </InputGroup>
                                    <ErrorMessage
                                      name="password"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="first_name" sm={4}>
                                    Họ
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="first_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="first_name"
                                          id="first_name"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="first_name"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="last_name" sm={4}>
                                    Tên
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="last_name"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="last_name"
                                          id="last_name"
                                          placeholder=""
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="last_name"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="gender_1" sm={4}>
                                    Giới tính
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Row>
                                      {genders.map(({ name, id }, idx) => {
                                        return (
                                          <Col xs={4} key={`gender-${idx}`}>
                                            <FormGroup check>
                                              <Label check>
                                                <Field
                                                  name="gender"
                                                  render={({
                                                    field /* _form */,
                                                  }) => (
                                                    <Input
                                                      {...field}
                                                      onBlur={null}
                                                      value={id}
                                                      type="radio"
                                                      checked={
                                                        1 * values.gender ===
                                                        1 * id
                                                      }
                                                      id={`gender_${id}`}
                                                      disabled={noEdit}
                                                    />
                                                  )}
                                                />{" "}
                                                {name}
                                              </Label>
                                            </FormGroup>
                                          </Col>
                                        );
                                      })}
                                      <ErrorMessage
                                        name="gender"
                                        component={({ children }) => (
                                          <Alert
                                            color="danger"
                                            className="field-validation-error"
                                          >
                                            {children}
                                          </Alert>
                                        )}
                                      />
                                    </Row>
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="birthday" sm={4}>
                                    Ngày sinh
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="birthday"
                                      render={({
                                        date,
                                        form: {
                                          setFieldValue,
                                          setFieldTouched,
                                          values,
                                        },
                                        field,
                                        ...props
                                      }) => {
                                        return (
                                          <DatePicker
                                            id="birthday"
                                            date={
                                              values.birthday
                                                ? moment(values.birthday)
                                                : null
                                            }
                                            onDateChange={(date) => {
                                              setFieldValue("birthday", date);
                                            }}
                                            disabled={noEdit}
                                            maxToday
                                          />
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name="birthday"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="phone_number" sm={4}>
                                    Điện thoại
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={7}>
                                    <Field
                                      name="phone_number"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="phone_number"
                                          id="phone_number"
                                          min={0}
                                          minLength={10}
                                          maxLength={11}
                                          placeholder="0777777777"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="phone_number"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                              <Col xs={12} sm={6}>
                                <FormGroup row>
                                  <Label for="email" sm={4}>
                                    Email
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={8}>
                                    <Field
                                      name="email"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="email"
                                          name="email"
                                          id="email"
                                          placeholder="employee.0001@company.com"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="email"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col xs={12}>
                                <FormGroup row>
                                  <Label for="address" sm={2}>
                                    Địa chỉ
                                    <span className="font-weight-bold red-text">
                                      *
                                    </span>
                                  </Label>
                                  <Col sm={10}>
                                    <Field
                                      name="address"
                                      render={({ field /* _form */ }) => (
                                        <Input
                                          {...field}
                                          onBlur={null}
                                          type="text"
                                          name="address"
                                          id="address"
                                          placeholder="436/77/77/7 CMT8"
                                          disabled={noEdit}
                                        />
                                      )}
                                    />
                                    <ErrorMessage
                                      name="address"
                                      component={({ children }) => (
                                        <Alert
                                          color="danger"
                                          className="field-validation-error"
                                        >
                                          {children}
                                        </Alert>
                                      )}
                                    />
                                  </Col>
                                </FormGroup>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={12} className="text-right">
                                {noEdit ? (
                                  <Button
                                    color="primary"
                                    className="mr-2 btn-block-sm"
                                    onClick={() =>
                                      window._$g.rdr(
                                        `/customers/edit/${customerEnt.customer_id}`
                                      )
                                    }
                                  >
                                    <i className="fa fa-edit mr-1" />
                                    Chỉnh sửa
                                  </Button>
                                ) : (
                                  [
                                    customerEnt && customerEnt.customer_id && (
                                      <Button
                                        color="warning text-white"
                                        className="mr-2 btn-block-sm"
                                        onClick={() =>
                                          window._$g.rdr(
                                            `/customers/change-password/${customerEnt.customer_id}`
                                          )
                                        }
                                      >
                                        <i className="fa fa-lock mr-1"></i>
                                        Thay đổi mật khẩu
                                      </Button>
                                    ),
                                    <Button
                                      key="buttonSave"
                                      type="submit"
                                      color="primary"
                                      disabled={isSubmitting}
                                      onClick={() => this.handleSubmit("save")}
                                      className="mr-2 btn-block-sm"
                                    >
                                      <i className="fa fa-save mr-2" />
                                      Lưu
                                    </Button>,
                                    <Button
                                      key="buttonSaveClose"
                                      type="submit"
                                      color="success"
                                      disabled={isSubmitting}
                                      onClick={() =>
                                        this.handleSubmit("save_n_close")
                                      }
                                      className="mr-2 btn-block-sm mt-md-0 mt-sm-2"
                                    >
                                      <i className="fa fa-save mr-2" />
                                      Lưu &amp; Đóng
                                    </Button>,
                                  ]
                                )}
                                <Button
                                  onClick={() => window._$g.rdr("/customers")}
                                  className="btn-block-sm mt-md-0 mt-sm-2"
                                >
                                  <i className="fa fa-times-circle mr-1" />
                                  Đóng
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Form>
                    );
                  }}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
