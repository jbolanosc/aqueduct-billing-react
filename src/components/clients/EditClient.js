import React, { Fragment, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import firebase from "../firebase/firebase";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

import Loading from "../layout/Loader";
import { InputField, ErrorField } from "../fields/inputField";

const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "name Too Short!")
    .max(100, "name Too Long!")
    .required("name Required"),
  address: Yup.string()
    .min(5, "address Too Short!")
    .max(70, "address Too Long!")
    .required("address Required"),
  email: Yup.string()
    .email("Email Invalid email")
    .required("Email Required"),
  IdNumber: Yup.number()
    .min(2, "ID Number Too Short!")
    .max(999999999999999999, "ID Number Too Long!")
    .integer("Only numbers are allowed")
    .required("Id Number Required"),
  phone: Yup.number()
    .min(6, "Phone Too Short!")
    .max(9999999999, "Phone Too Long!")
    .integer("Only numbers are allowed")
    .required("phone Required"),
  electricityMeter: Yup.number()
    .min(1, "Electricity Meter Too Short!")
    .max(99999, "Electricity Meter Too Long!")
    .integer("Only numbers are allowed")
    .required("Electricity Meter Required")
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

const EditClient = props => {
  const [isLoading, setIsLoading] = useState(1);
  const [key, setkey] = useState("");
  const [client, setClient] = useState({
    name: "",
    address: "",
    IdNumber: "",
    email: "",
    phone: "",
    electricityMeter: ""
  });

  const saveClient = () => {
    const { name, address, IdNumber, phone, email, electricityMeter } = client;
    const updateRef = firebase
      .firestore()
      .collection("clients")
      .doc(key);

    updateRef
      .set({
        name,
        address,
        IdNumber,
        email,
        phone,
        electricityMeter
      })
      .then(docRef => {
        generateToast(false, "Client updated.");
        props.history.push("/clients");
      })
      .catch(error => {
        generateToast(true, "Error updating document: ", error);
      });
  };

  const handleChange = name => event => {
    setClient({ ...client, [name]: event.target.value });
  };

  useEffect(() => {
    const loadClient = () => {
      const ref = firebase
        .firestore()
        .collection("clients")
        .doc(props.match.params.id);
      ref.get().then(doc => {
        if (doc.exists) {
          const data = doc.data();
          setkey(props.match.params.id);
          setClient(data);
        } else {
          generateToast(true, "No document with given ID.");
          props.history.push("/clients");
        }
      });
    };

    const loading = () => {
      setTimeout(() => {
        setIsLoading(0);
      }, 1200);
    };
    loadClient();
    loading();
  }, [props.history, props.match.params.id]);

  return (
    <div className="container">
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <Fragment>
          <h2 className="m-1">Edit Client</h2>
          <Formik
            onSubmit={data => {
              saveClient();
            }}
            validationSchema={SignupSchema}
            initialValues={{
              name: client.name,
              address: client.address,
              IdNumber: client.IdNumber,
              email: client.email,
              phone: client.phone,
              electricityMeter: client.electricityMeter
            }}
          >
            {({ touched, errors }) => (
              <Form>
                <Field
                  name="name"
                  placeholder="name"
                  component={InputField}
                  value={client.name}
                  onChange={handleChange("name")}
                />
                {errors.name && touched.name ? (
                  <ErrorMessage
                    errors={errors.name}
                    name="name"
                    component={ErrorField}
                  />
                ) : null}
                <Field
                  name="address"
                  placeholder="address"
                  component={InputField}
                  value={client.address}
                  onChange={handleChange("address")}
                />
                {errors.address && touched.address ? (
                  <ErrorMessage
                    errors={errors.address}
                    name="address"
                    component={ErrorField}
                  />
                ) : null}
                <Field
                  name="IdNumber"
                  placeholder="ID number"
                  component={InputField}
                  value={client.IdNumber}
                  onChange={handleChange("IdNumber")}
                />
                {errors.IdNumber && touched.IdNumber ? (
                  <ErrorMessage
                    errors={errors.IdNumber}
                    name="IdNumber"
                    component={ErrorField}
                  />
                ) : null}
                <Field
                  name="email"
                  placeholder="Email"
                  component={InputField}
                  value={client.email}
                  onChange={handleChange("email")}
                />
                {errors.email && touched.email ? (
                  <ErrorMessage
                    errors={errors.email}
                    name="email"
                    component={ErrorField}
                  />
                ) : null}
                <Field
                  name="phone"
                  type="number"
                  step="1"
                  placeholder="Phone"
                  component={InputField}
                  value={client.phone}
                  onChange={handleChange("phone")}
                />
                {errors.phone && touched.phone ? (
                  <ErrorMessage
                    errors={errors.phone}
                    name="phone"
                    component={ErrorField}
                  />
                ) : null}
                <Field
                  name="electricityMeter"
                  placeholder="electricity Meter"
                  component={InputField}
                  value={client.electricityMeter}
                  onChange={handleChange("electricityMeter")}
                />
                {errors.electricityMeter && touched.electricityMeter ? (
                  <ErrorMessage
                    errors={errors.electricityMeter}
                    name="electricityMeter"
                    component={ErrorField}
                  />
                ) : null}
                <button type="submit" className="btn btn-info">
                  Save
                </button>
              </Form>
            )}
          </Formik>
        </Fragment>
      )}
    </div>
  );
};

export default EditClient;
