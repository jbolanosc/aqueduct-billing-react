import React, { useState, useEffect } from "react";
import { Link, useRouteMatch } from "react-router-dom";
import firebase from "../firebase/firebase";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

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

const Billing = () => {
  const [billing, setBilling] = useState([]);
  const [data, setData] = useState([]);

  let { url } = useRouteMatch();

  const ref = firebase.firestore().collection("billing");

  const onCollectionUpdate = querySnapshot => {
    const firebaseData = [];
    querySnapshot.forEach(doc => {
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
      } = doc.data();
      firebaseData.push({
        key: doc.id,
        doc,
        client,
        month,
        lastMonth,
        actual,
        state,
        m3,
        base,
        penaltyFee,
        total
      });
    });
    setData(firebaseData);
    setBilling(firebaseData);
  };

  const deleteBilling = id => {
    ref
      .doc(id)
      .delete()
      .then(() => {
        generateToast(false, "Billing successfully deleted!");
      })
      .catch(error => {
        generateToast(false, "Error removing document: " + error);
      });
  };

  const handleChange = name => event => {
    filterData(event.target.value);
  };

  const filterData = filter => {
    if (filter === "") {
      setBilling(data);
    } else {
      setBilling(data);
      const result = data.filter(billing => billing.client.includes(filter));
      setBilling(result);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const ref = firebase.firestore().collection("billing");
    ref.onSnapshot(onCollectionUpdate);
    return () => (isSubscribed = false);
  }, []);

  return (
    <React.Fragment>
      <div className="form-group w-25 m-2 float-right">
        <input
          placeholder="Filter By name"
          className="form-control"
          type="text"
          onChange={handleChange("filter")}
        />
      </div>
      <table className="table table-bordered table-info">
        <thead>
          <tr>
            <th scope="col">Client</th>
            <th scope="col">Month</th>
            <th scope="col">Last Month lecture</th>
            <th scope="col">Actual lecture</th>
            <th scope="col">State</th>
            <th scope="col">m3</th>
            <th scope="col">Base</th>
            <th scope="col">Penalty fee</th>
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {billing.map(billing => (
            <tr key={billing.key}>
              <td>{billing.client}</td>
              <td>{billing.month}</td>
              <td>{billing.lastMonth}</td>
              <td>{billing.actual}</td>
              <td>{billing.state}</td>
              <td>{billing.m3}</td>
              <td>{billing.base}</td>
              <td>{billing.penaltyFee}</td>
              <td>{billing.total}</td>
              <td>
                <Link
                  to={`${url}/editBilling/${billing.key}`}
                  className="btn btn-success btn-md"
                >
                  Edit
                </Link>
              </td>
              <td>
                <button
                  onClick={() => deleteBilling(billing.key)}
                  className="btn btn-danger btn-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
};

export default Billing;
