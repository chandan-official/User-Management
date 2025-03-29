import "./User.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

function User() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search query state
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    axios
      .get(`https://reqres.in/api/users?page=${pageNumber}`, {
        signal: controller.signal,
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setUsers(response.data.data);
          setTotalPages(response.data.total_pages);
        } else {
          console.error(
            "Failed to fetch Users:",
            response.data?.message || "Unexpected response structure"
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request canceled", error.message);
        } else {
          console.error("Error fetching Users:", error.message);
        }
        setLoading(false);
      });

    return () => controller.abort();
  }, [pageNumber]);

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    if (newPage !== pageNumber) {
      setPageNumber(newPage);
    }
  };

  const handleEdit = (user) => {
    navigate(`/edit/${user.id}`, { state: { user } });
  };

  const handleDelete = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://reqres.in/api/users/${userId}`)
          .then((response) => {
            if (response.status !== 204) {
              throw new Error("Failed to delete user");
            }
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user.id !== userId)
            );
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting user:", error.message);
            Swal.fire(
              "Error!",
              "Failed to delete user. Please try again.",
              "error"
            );
          });
      }
    });
  };

  // ✅ Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-page">
      <h1>User List</h1>

      {/* ✅ Search Input */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="user-container">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div className="user-detail" key={user.id}>
                  <div className="avatar">
                    <img src={user.avatar} alt="User Avatar" />
                  </div>
                  <h1>First Name: {user.first_name}</h1>
                  <h1>Last Name: {user.last_name}</h1>
                  <p>Email: {user.email}</p>
                  <p>User Id: {user.id}</p>
                  <div className="curd-btn">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No users found</p>
            )}
          </div>

          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={totalPages}
            forcePage={pageNumber - 1}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
          />
        </>
      )}
    </div>
  );
}

export default User;
