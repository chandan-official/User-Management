import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./Edit.css";

function Edit() {
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.user || {};

  const [user, setUser] = useState({
    first_name: userData.first_name || "",
    last_name: userData.last_name || "",
    email: userData.email || "",
    avatar: userData.avatar || "",
  });

  const [preview, setPreview] = useState(userData.avatar || "");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
      setUser({ ...user, avatar: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`https://reqres.in/api/users/${userData.id}`, user)
      .then((response) => {
        console.log("User updated:", response.data);

        // 🎉 Show success pop-up
        Swal.fire({
          title: "Success!",
          text: "User updated successfully!",
          icon: "success",
          confirmButtonColor: "#007bff",
        }).then(() => {
          navigate("/user"); // Redirect after confirmation
        });
      })
      .catch((error) => {
        console.error("Error updating user:", error.message);

        // ❌ Show error pop-up
        Swal.fire({
          title: "Error!",
          text: "Failed to update user. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      });
  };

  return (
    <div className="edit-user-page">
      <h1>Edit User</h1>
      <form onSubmit={handleSubmit}>
        <div className="avatar-section">
          <label>Profile Picture:</label>
          <div className="avatar-preview">
            <img src={preview} alt="User Avatar" />
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <label>
          First Name:
          <input
            type="text"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Update User</button>
      </form>
    </div>
  );
}

export default Edit;
