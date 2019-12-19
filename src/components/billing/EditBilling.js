import React, { Fragment, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import firebase from "../firebase/firebase";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { InputField, ErrorField } from "../fields/inputField";
import Loading from "../layout/Loader";

const SignupSchema = Yup.object().shape({
  client: Yup.string()
    .min(2, "client Too Short!")
    .max(100, "client Too Long!"),
  month: Yup.string().required("Month Required"),
  lastMonth: Yup.number()
    .max(99999, "last Month  Too Long!")
    .positive("Only positive numbers are allowed")
    .required("last Month Required"),
  actual: Yup.number()
    .max(99999, "actual lecture Too Long!")
    .positive("Only positive numbers are allowed")
    .required("actual lecture Required"),
  state: Yup.string().required("state Required"),
  m3: Yup.number()
    .max(99999, "m3  Too Long!")
    .positive("Only positive numbers are allowed")
    .required("m3 Required"),
  base: Yup.number()
    .max(99999, "base  Too Long!")
    .integer("Only numbers are allowed")
    .required("base Required"),
  penaltyFee: Yup.number()
    .max(99999, "penalty Fee  Too Long!")
    .integer("Only numbers are allowed")
    .required("penalty Fee Required"),
  total: Yup.number()
});

const generateToast = (err, msg) => {
  const red =
    "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(215,14,14,1) 99%, rgba(0,212,255,1) 100%)";
  const green =
    "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,212,255,1) 0%, rgba(139,213,86,1) 0%)";
  if (err) {
    Toastify({
      text: msg,
      duration: 5000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      backgroundColor: red,
      className: "info",
      stopOnFocus: true // Prevents dismissing of toast on hover
    }).showToast();
  } else {
    Toastify({
      text: msg,
      duration: 5000,
      close: true,
      gravity: "bottom", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      backgroundColor: green,
      className: "info",
      stopOnFocus: true // Prevents dismissing of toast on hover
    }).showToast();
  }
};

const BillingForm = props => {
  const [key, setkey] = useState("");
  const [isLoading, setIsLoading] = useState("1");
  const [bussiness, setBussiness] = useState({
    baseD: "",
    baseC: "",
    priceM3: ""
  });
  const [billing, setBilling] = useState({
    client: "",
    month: "",
    lastMonth: "",
    actual: "",
    state: "",
    m3: "",
    base: "",
    penaltyFee: "",
    total: ""
  });

  const getBillingData = querySnapshot => {
    const data = [];
    querySnapshot.forEach(doc => {
      const { baseD, baseC, priceM3 } = doc.data();
      data.push({
        key: doc.id,
        doc,
        baseD,
        baseC,
        priceM3
      });
    });
    setBussiness(data[0]);
  };

  const generateTotal = () => {
    billing.total = bussiness.priceM3 * billing.m3;
    billing.total =
      parseFloat(billing.total) +
      parseFloat(billing.base) +
      parseFloat(billing.penaltyFee);
  };

  const updateBilling = () => {
    const {
      client,
      month,
      lastMonth,
      actual,
      state,
      m3,
      base,
      penaltyFee,
      total
    } = billing;

    const updateRef = firebase
      .firestore()
      .collection("billing")
      .doc(key);

    updateRef
      .set({
        client,
        month,
        lastMonth,
        actual,
        state,
        m3,
        base,
        penaltyFee,
        total
      })
      .then(docRef => {
        generateToast(false, "Billing updated.");
        props.history.push("/billing");
      })
      .catch(error => {
        generateToast(true, "Error updating document: ", error);
      });
  };

  const handleChange = name => event => {
    setBilling({ ...billing, [name]: event.target.value });
  };

  useEffect(() => {
    const refBussiness = firebase.firestore().collection("Bussiness");
    refBussiness.onSnapshot(getBillingData);
    const loadBilling = () => {
      const ref = firebase
        .firestore()
        .collection("billing")
        .doc(props.match.params.id);
      ref.get().then(doc => {
        if (doc.exists) {
          const data = doc.data();
          setkey(props.match.params.id);
          setBilling(data);
        } else {
          generateToast(true, "No document with given ID.");
          props.history.push("/billing");
        }
      });
    };

    const loading = () => {
      setTimeout(() => {
        setIsLoading("");
      }, 1200);
    };

    loadBilling();
    loading();
  }, [props.history, props.match.params.id]);

  return (
    <div className="container-fluid">
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <Fragment>
          <h2 className="m-1">Edit Billing</h2>
          <Formik
            onSubmit={data => {
              generateTotal();
              updateBilling();
            }}
            validationSchema={SignupSchema}
            initialValues={{
              client: billing.client,
              month: billing.month,
              lastMonth: billing.lastMonth,
              actual: billing.actual,
              state: billing.state,
              m3: billing.m3,
              base: billing.base,
              penaltyFee: billing.penaltyFee,
              total: billing.total
            }}
          >
            {({ touched, errors }) => (
              <Form>
                <div className="row">
                  <div className="col-md-6">
                    <Field
                      name="client"
                      placeholder="client"
                      component={InputField}
                      value={billing.client}
                      onChange={handleChange("client")}
                      readOnly
                    />
                    {errors.client && touched.client ? (
                      <ErrorMessage
                        errors={errors.client}
                        name="client"
                        component={ErrorField}
                      />
                    ) : null}
                    <div className="form-group">
                      <label>Month</label>
                      <Field
                        as="select"
                        name="month"
                        className="form-control"
                        required
                        value={billing.month}
                        onChange={handleChange("month")}
                      >
                        <option value="" label="Select a month" />
                        <option
                          label="January"
                          value={"January " + new Date().getFullYear()}
                        />
                        <option
                          label="February"
                          value={"February " + new Date().getFullYear()}
                        />
                        <option
                          label="March"
                          value={"March " + new Date().getFullYear()}
                        />
                        <option
                          label="April"
                          value={"April " + new Date().getFullYear()}
                        />
                        <option
                          label="May"
                          value={"May " + new Date().getFullYear()}
                        />
                        <option
                          label="June"
                          value={"June " + new Date().getFullYear()}
                        />
                        <option
                          label="July"
                          value={"July " + new Date().getFullYear()}
                        />
                        <option
                          label="August"
                          value={"August " + new Date().getFullYear()}
                        />
                        <option
                          label="September"
                          value={"September " + new Date().getFullYear()}
                        />
                        <option
                          label="October"
                          value={"October " + new Date().getFullYear()}
                        />
                        <option
                          label="November"
                          value={"November " + new Date().getFullYear()}
                        />
                        <option
                          label="December"
                          value={"December " + new Date().getFullYear()}
                        />
                      </Field>
                    </div>
                    {errors.month && touched.month ? (
                      <ErrorMessage
                        errors={errors.month}
                        name="month"
                        component={ErrorField}
                      />
                    ) : null}
                    <Field
                      name="lastMonth"
                      placeholder="last Month"
                      component={InputField}
                      type="number"
                      value={billing.lastMonth}
                      onChange={handleChange("lastMonth")}
                    />
                    {errors.lastMonth && touched.lastMonth ? (
                      <ErrorMessage
                        errors={errors.lastMonth}
                        name="lastMonth"
                        component={ErrorField}
                      />
                    ) : null}
                    <Field
                      name="actual"
                      placeholder="actual"
                      component={InputField}
                      type="number"
                      value={billing.actual}
                      onChange={handleChange("actual")}
                    />
                    {errors.actual && touched.actual ? (
                      <ErrorMessage
                        errors={errors.actual}
                        name="actual"
                        component={ErrorField}
                      />
                    ) : null}
                    <div className="form-group">
                      <label>Billing Status</label>
                      <Field
                        as="select"
                        name="state"
                        className="form-control"
                        value={billing.state}
                        onChange={handleChange("state")}
                      >
                        <option value="" label="Select Status" />
                        <option value="Paid" label="Paid" />
                        <option value="Unpaid" label="Unpaid" />
                      </Field>
                      {errors.state && touched.state ? (
                        <ErrorMessage
                          errors={errors.state}
                          name="base"
                          component={ErrorField}
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <Field
                      name="m3"
                      placeholder="m3"
                      type="number"
                      component={InputField}
                      value={billing.m3}
                      onChange={handleChange("m3")}
                    />
                    {errors.m3 && touched.m3 ? (
                      <ErrorMessage
                        errors={errors.m3}
                        name="m3"
                        component={ErrorField}
                      />
                    ) : null}
                    <div className="form-group">
                      <label>Base</label>
                      <Field
                        as="select"
                        name="base"
                        className="form-control"
                        value={billing.base}
                        onChange={handleChange("base")}
                      >
                        <option value="" label="Select base" />
                        <option value={bussiness.baseD} label="domicile" />
                        <option value={bussiness.baseC} label="comercial" />
                      </Field>
                      {errors.base && touched.base ? (
                        <ErrorMessage
                          errors={errors.base}
                          name="base"
                          component={ErrorField}
                        />
                      ) : null}
                    </div>

                    <Field
                      name="penaltyFee"
                      placeholder="penalty Fee"
                      type="number"
                      component={InputField}
                      value={billing.penaltyFee}
                      onChange={handleChange("penaltyFee")}
                    />
                    {errors.penaltyFee && touched.penaltyFee ? (
                      <ErrorMessage
                        errors={errors.penaltyFee}
                        name="penaltyFee"
                        component={ErrorField}
                      />
                    ) : null}
                    <Field
                      name="total"
                      placeholder="total"
                      type="number"
                      component={InputField}
                      value={billing.total}
                      onChange={handleChange("total")}
                      readOnly
                    />
                    <button type="submit" className="btn btn-info">
                      Submit and generate total
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </Fragment>
      )}
    </div>
  );
};

export default BillingForm;
