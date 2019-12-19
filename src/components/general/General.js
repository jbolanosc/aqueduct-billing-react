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

const General = (props) => {
  const [bussiness, setBussiness] = useState({
    name: "",
    baseC: "",
    baseD: "",
    priceM3: ""
  });

  const onCollectionUpdate = querySnapshot => {
    const firebaseData = [];
    querySnapshot.forEach(doc => {
      const { name, baseC, baseD, priceM3 } = doc.data();
      firebaseData.push({
        key: doc.id,
        doc,
        name,
        baseC,
        baseD,
        priceM3
      });
    });
    setBussiness(firebaseData[0]);
  };

  const updateData = (e) => {
    e.preventDefault();
    const { key, name, baseC, baseD, priceM3 } = bussiness;
    const updateRef = firebase
      .firestore()
      .collection("Bussiness")
      .doc(key);

    updateRef
      .set({
        name, baseC, baseD, priceM3 
      })
      .then(docRef => {
        generateToast(false, "Data updated.");
        props.history.push("/");
      })
      .catch(error => {
        generateToast(true, "Error updating document: ", error);
      });
  };

  const handleChange = name => event => {
    setBussiness({ ...bussiness, [name]: event.target.value });
  };


  useEffect(() => {
    let isSubscribed = true;
    const ref = firebase.firestore().collection("Bussiness");
    ref.onSnapshot(onCollectionUpdate);

    return () => (isSubscribed = false);
  }, []);

  return (
    <React.Fragment>
      <div className="Container">
        <h3>Comercial Data</h3>
        <form onSubmit={(e) => updateData(e)}>
          <div className="form-group">
            <label>Bussiness name</label>
            <input
              className="form-control"
              type="text"
              value={bussiness.name}
              onChange={handleChange("name")}
            />
          </div>
          <div className="form-group">
            <label>Comercial Base</label>
            <input
              className="form-control"
              type="number"
              value={bussiness.baseC}
              onChange={handleChange("baseC")}
            />
          </div>
          <div className="form-group">
            <label>Domicile Base</label>
            <input
              className="form-control"
              type="number"
              value={bussiness.baseD}
              onChange={handleChange("baseD")}
            />
          </div>
          <div className="form-group">
            <label>Price m3</label>
            <input
              className="form-control"
              type="number"
              value={bussiness.priceM3}
              onChange={handleChange("priceM3")}
            />
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    </React.Fragment>
  );
};

export default General;
