import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import firebase from "../firebase/firebase";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import { InputField, ErrorField } from "../fields/inputField";

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
  const ref = firebase.firestore().collection("billing");
  const refBussiness = firebase.firestore().collection("Bussiness");
  const refClient = firebase.firestore().collection("clients");

  const [bussiness, setBussiness] = useState({
    baseD: "",
    baseC: "",
    priceM3: ""
  });
  const [client, setClient] = useState({
    name: ""
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

  const getClientInfo = () => {
    if (!client.IdNumber) {
      return;
    } else {
      refClient
        .where("IdNumber", "==", client.IdNumber)
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            generateToast(true, "No document with given ID.");
            return;
          }
          generateToast(false, "Client loaded.");
          snapshot.forEach(doc => {
            setClient(doc.data());
          });
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });
    }
  };

  const generateTotal = data => {
    data.total = bussiness.priceM3 * data.m3;
    data.total =
      parseFloat(data.total) +
      parseFloat(data.base) +
      parseFloat(data.penaltyFee);
  };

  const saveBilling = data => {
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
    } = data;

    ref
      .add({
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
        generateToast(false, "Billing saved.");
        props.history.push("/billing");
      })
      .catch(error => {
        generateToast(true, "Error adding document: ", error);
      });
  };

  const handleClient = name => event => {
    setClient({ ...client, [name]: event.target.value });
  };

  useEffect(() => {
    refBussiness.onSnapshot(getBillingData);
  }, [refBussiness]);

  return (
    <div className="container-fluid">
      <h2 className="m-1">Billing Registration</h2>
      <Formik
        onSubmit={data => {
          data.client = client.name;
          generateTotal(data);
          saveBilling(data);
        }}
        validationSchema={SignupSchema}
        initialValues={{
          client: client.name,
          month: "",
          lastMonth: "",
          actual: "",
          state: "",
          m3: "",
          base: "",
          penaltyFee: "",
          total: ""
        }}
      >
        {({ touched, errors }) => (
          <Form>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Client ID</label>
                  <input
                    onChange={handleClient("IdNumber")}
                    className="form-control"
                    type="text"
                    required
                  />
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => getClientInfo()}
                  >
                    Get Client
                  </button>
                </div>
                <Field
                  name="client"
                  placeholder="client"
                  component={InputField}
                  value={client.name}
                  readOnly
                  required
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
                  >
                    <option value="" label="Select a month" />
                    <option label="January" value={"January " +new Date().getFullYear()} />
                    <option label="February" value={"February " +new Date().getFullYear()}  />
                    <option label="March" value={"March " +new Date().getFullYear()} />
                    <option label="April" value={"April " +new Date().getFullYear()}  />
                    <option label="May" value={"May " +new Date().getFullYear()} />
                    <option label="June" value={"June " +new Date().getFullYear()}  />
                    <option label="July" value={"July " +new Date().getFullYear()}  />
                    <option label="August" value={"August " +new Date().getFullYear()}  />
                    <option label="September" value={"September " +new Date().getFullYear()}  />
                    <option label="October" value={"October " +new Date().getFullYear()}  />
                    <option label="November" value={"November " +new Date().getFullYear()}  />
                    <option label="December" value={"December " +new Date().getFullYear()}  />
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
                  <Field as="select" name="state" className="form-control">
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
                  <Field as="select" name="base" className="form-control">
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
    </div>
  );
};

export default BillingForm;
