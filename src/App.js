import React, { useState } from "react";
import axios from "axios";

function UserForm() {
  const [form, setForm] = useState({ name: "", email: "", age: "", id: "" });
  const [isUpdate, setIsUpdate] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isUpdate) {
      await axios.put(`https://mastech-hgfgajcuc6ftb9fn.canadacentral-01.azurewebsites.net/api/users/${form.id}`, form);
      alert("User updated!");
    } else {
      await axios.post("https://mastech-hgfgajcuc6ftb9fn.canadacentral-01.azurewebsites.net/api/users", form);
      alert("User added!");
    }
    setForm({ name: "", email: "", age: "", id: "" });
    setIsUpdate(false);
  };

  return (
    <div style={{ margin: "20px" }}>
      <h2>{isUpdate ? "Update User" : "Add User"}</h2>
      {isUpdate && (
        <input
          type="text"
          name="id"
          placeholder="User ID"
          value={form.id}
          onChange={handleChange}
        />
      )}
      <br />
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      <br />
      <input
        type="text"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <br />
      <input
        type="number"
        name="age"
        placeholder="Age"
        value={form.age}
        onChange={handleChange}
      />
      <br />
      <button onClick={handleSubmit}>
        {isUpdate ? "Update User" : "Add User"}
      </button>
      <br />
      <button onClick={() => setIsUpdate(!isUpdate)}>
        Switch to {isUpdate ? "Add" : "Update"}
      </button>
    </div>
  );
}

export default UserForm;
