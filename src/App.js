import React, { useState, useEffect } from "react";
import "./App.css";
import db from "./firebase";
import {
  doc,
  setDoc,
  onSnapshot,
  collection,
  query,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const App = () => {
  const [customerName, setCustomerName] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [customersData, setCustomersData] = useState([]);
  const [updatedCustomerName, setUpdatedCustomerName] = useState("");
  const [updatedCustomerPassword, setUpdatedCustomerPassword] = useState("");
  const [dataIdToBeUpdated, setDataIdToBeUpdated] = useState("");

  useEffect(() => {
    const q = query(collection(db, "customersData"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newData = [];
      querySnapshot.forEach((doc) => {
        newData.push({ id: doc.id, data: doc.data() });
      });
      setCustomersData(newData);
    });

    return () => {
      unsubscribe(); // Unsubscribe when the component unmounts
    };
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    const randomString = generateRandomString(10);

    await setDoc(doc(db, "customersData", randomString), {
      name: customerName,
      password: customerPassword,
    });

    setCustomerName("");
    setCustomerPassword("");
  };

  const updateData = async (e) => {
    e.preventDefault();

    const custRef = doc(db, "customersData", dataIdToBeUpdated);

    await updateDoc(custRef, {
      name: updatedCustomerName,
      password: updatedCustomerPassword,
    });

    setUpdatedCustomerPassword("");
    setUpdatedCustomerName("");
    setDataIdToBeUpdated("");
  };

  const deleteData = async (id) => {
    await deleteDoc(doc(db, "customersData", id));
  };

  const generateRandomString = (length) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
    return randomString;
  };

  return (
    <div className="App">
      {!dataIdToBeUpdated ? (
        <div className="App__form">
          <input
            type="text"
            placeholder="Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            value={customerPassword}
            onChange={(e) => setCustomerPassword(e.target.value)}
          />
          <button onClick={submit}>Submit</button>
        </div>
      ) : (
        <div className="App__Updateform">
          <input
            type="text"
            placeholder="Name"
            value={updatedCustomerName}
            onChange={(e) => setUpdatedCustomerName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Password"
            value={updatedCustomerPassword}
            onChange={(e) => setUpdatedCustomerPassword(e.target.value)}
          />
          <button onClick={updateData}>Update</button>
        </div>
      )}
      <div className="App__DataDisplay">
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>PASSWORD</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {customersData?.map(({ id, data }) => (
              <tr key={id}>
                <td>{data.name}</td>
                <td>{data.password}</td>
                <td>
                  <button
                    onClick={() => {
                      setDataIdToBeUpdated(id);
                      setUpdatedCustomerPassword(data.password);
                      setUpdatedCustomerName(data.name);
                    }}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => {
                      deleteData(id);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
