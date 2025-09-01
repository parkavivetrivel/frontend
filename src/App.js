import React, { useState } from "react";
import axios from "axios";

function App() {
  // ================= User Form State =================
  const [form, setForm] = useState({ name: "", email: "", age: "", id: "" });
  const [isUpdate, setIsUpdate] = useState(false);

  // ================= Image Upload State =================
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");

  // 👉 Replace this with your container SAS URL
  const containerSasUrl =
    "https://resizest.blob.core.windows.net/original-files?sp=rw&st=2025-09-01T10:31:52Z&se=2025-09-01T18:46:52Z&spr=https&sv=2024-11-04&sr=c&sig=XqP8yZnfoBZaF8PHAkMjf%2FSJ0y3%2BU3gwQHoGmrFcP7A%3D";

  // ================= User Form Handlers =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isUpdate) {
        await axios.put(
          `https://server-h8epcuame2h8cwa6.canadacentral-01.azurewebsites.net/api/users/${form.id}`,
          form
        );
        alert("User updated!");
      } else {
        await axios.post(
          "https://server-h8epcuame2h8cwa6.canadacentral-01.azurewebsites.net/api/users",
          form
        );
        alert("User added!");
      }
      setForm({ name: "", email: "", age: "", id: "" });
      setIsUpdate(false);
    } catch (err) {
      console.error("Error submitting user:", err);
      alert("Error occurred!");
    }
  };

  // ================= Image Upload Handlers =================
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first!");

    setUploading(true);
    try {
      // Build blob URL
      const blobBaseUrl = containerSasUrl.split("?")[0]; // base URL without SAS
      const sasToken = containerSasUrl.split("?")[1]; // SAS token only
      const uniqueFileName = `${Date.now()}-${file.name}`;
      const uploadUrl = `${blobBaseUrl}/${uniqueFileName}?${sasToken}`;

      // Upload file directly
      await axios.put(uploadUrl, file, {
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": file.type,
        },
      });

      setUploadedUrl(`${blobBaseUrl}/${uniqueFileName}`);
      alert("Upload successful!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed!");
    }
    setUploading(false);
  };

  // ================= Render =================
  return (
    <div style={{ margin: "20px" }}>
      {/* User Form */}
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

      <hr />

      {/* Image Upload */}
      <h2>Upload Image to Azure Blob Storage</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {uploadedUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Uploaded Image:</p>
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            {uploadedUrl}
          </a>
          <br />
          <img
            src={uploadedUrl}
            alt="Uploaded"
            style={{ marginTop: "10px", width: "250px", borderRadius: "8px" }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
