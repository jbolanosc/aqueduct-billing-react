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

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [data, setData] = useState([]);

  let { url } = useRouteMatch();

  const ref = firebase.firestore().collection("clients");

  const onCollectionUpdate = querySnapshot => {
    const firebaseData = [];
    querySnapshot.forEach(doc => {
      const {
        name,
        address,
        IdNumber,
        email,
        phone,
        electricityMeter
      } = doc.data();
      firebaseData.push({
        key: doc.id,
        doc,
        name,
        address,
        IdNumber,
        email,
        phone,
        electricityMeter
      });
    });
    setData(firebaseData);
    setClients(firebaseData);
  };

  const deleteClient = id => {
    ref
      .doc(id)
      .delete()
      .then(() => {
        generateToast(false, "Client successfully deleted!");
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
      setClients(data);
    } else {
      setClients(data);
      const result = data.filter(client => client.name.includes(filter));
      setClients(result);
    }
  };

  useEffect(() => {
    let isSubscribed = true;
    const ref = firebase.firestore().collection("clients");
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
            <th scope="col">FirstName</th>
            <th scope="col">Address</th>
            <th scope="col">ID number</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Electricity Meter</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.key}>
              <td>{client.name}</td>
              <td>{client.address}</td>
              <td>{client.IdNumber}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>{client.electricityMeter}</td>
              <td>
                <Link
                  to={`${url}/editClient/${client.key}`}
                  className="btn btn-success btn-md"
                >
                  Edit
                </Link>
              </td>
              <td>
                <button
                  onClick={() => deleteClient(client.key)}
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

export default Clients;
