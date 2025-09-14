import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { format } from "date-fns";
import toast from "react-hot-toast";
import axios from "axios";
import Header from "@/components/Header";

const HomePage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const BackendUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch users function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${BackendUrl}/api/auth/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Update user function
  const updateUser = async (userId) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.put(`${BackendUrl}/api/auth/update/${userId}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User updated successfully");
      setEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  // Delete user function
  const deleteUser = async (userId) => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`${BackendUrl}/api/auth/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || "",
      mobile: user.mobile || "",
      email: user.email || "",
      state: user.state || "",
      city: user.city || "",
      description: user.description || "",
      image: user.image || "",
    });
    setEditDialogOpen(true);
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // DataGrid columns
  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 150,
      renderCell: (params) => (
        <div className="font-medium text-gray-900">{params.value}</div>
      ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      renderCell: (params) => (
        <div className="text-blue-600 hover:text-blue-800">{params.value}</div>
      ),
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 130,
    },
    {
      field: "state",
      headerName: "State",
      width: 120,
      renderCell: (params) => (
        <span className="text-gray-600">{params.value || "-"}</span>
      ),
    },
    {
      field: "city",
      headerName: "City",
      width: 120,
      renderCell: (params) => (
        <span className="text-gray-600">{params.value || "-"}</span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      width: 150,
      renderCell: (params) => (
        <span className="text-sm text-gray-500">
          {params.value ? format(new Date(params.value), "dd-MM-yyyy") : "-"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      renderCell: (params) => {
        return (
          <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          >
            <div className="flex gap-1">
              <IconButton
                size="small"
                onClick={() => handleViewUser(params.row)}
                className="text-blue-600 hover:bg-blue-50"
              >
                <Visibility fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleEditUser(params.row)}
                className="text-green-600 hover:bg-green-50"
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => handleDeleteUser(params.row.id)}
                className="text-red-600 hover:bg-red-50"
              >
                <Delete fontSize="small" />
              </IconButton>
            </div>
          </Box>
        );
      },
    },
  ];

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Header />
      <div className="flex-1 px-[15%] py-[5%]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-700">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor all user accounts in your system
          </p>
        </div>

        <div className="mb-6">
          {selectedRows.length > 0 && (
            <div className="mb-4">
              <Button
                variant="contained"
                color="error"
                className="shadow-lg"
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete ${selectedRows.length} selected users?`
                    )
                  ) {
                    toast.info(
                      "Bulk delete functionality can be implemented here"
                    );
                  }
                }}
              >
                Delete Selected ({selectedRows.length})
              </Button>
            </div>
          )}
        </div>

        <Box
          sx={{
            height: 400,
            width: "100%",
            border: "2px solid #3b82f6",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(59, 130, 246, 0.1)",
          }}
        >
          <DataGrid
            rows={users}
            columns={columns}
            loading={loading}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={(newSelection) => {
              setSelectedRows(newSelection);
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            sx={{
              border: "none",
              backgroundColor: "white",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #e5e7eb",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#3b82f6",
                color: "black !important",
                borderBottom: "1px solid #3b82f6",
                fontWeight: "bold",
                "& .MuiDataGrid-columnHeader": {
                  color: "black !important",
                  "& .MuiDataGrid-columnHeaderTitle": {
                    color: "black !important",
                    fontWeight: "bold",
                  },
                },
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#eff6ff",
              },
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "#dbeafe",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#f8fafc",
                borderTop: "1px solid #e5e7eb",
              },
            }}
          />
        </Box>

        {/* Edit User Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="bg-blue-600 text-white font-semibold">
            Edit User
          </DialogTitle>
          <DialogContent>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <TextField
                label="Name"
                value={editFormData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Mobile"
                value={editFormData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={editFormData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="State"
                value={editFormData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="City"
                value={editFormData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Image URL"
                value={editFormData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                fullWidth
                margin="normal"
              />
            </div>
            <TextField
              label="Description"
              value={editFormData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
            />
          </DialogContent>
          <DialogActions className="bg-gray-50">
            <Button
              onClick={() => setEditDialogOpen(false)}
              className="text-gray-600"
            >
              Cancel
            </Button>
             <Button
               onClick={() => updateUser(selectedUser.id)}
               variant="contained"
               className="bg-blue-600 hover:bg-blue-700"
             >
               Update
             </Button>
          </DialogActions>
        </Dialog>

        {/* View User Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle className="bg-blue-600 text-white font-semibold">
            User Details
          </DialogTitle>
          <DialogContent>
            {selectedUser && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Name
                    </label>
                    <p className="text-lg">{selectedUser.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-lg">{selectedUser.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Mobile
                    </label>
                    <p className="text-lg">{selectedUser.mobile}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      State
                    </label>
                    <p className="text-lg">{selectedUser.state || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      City
                    </label>
                    <p className="text-lg">{selectedUser.city || "-"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Created Date
                    </label>
                    <p className="text-lg">
                      {selectedUser.createdAt
                        ? format(
                            new Date(selectedUser.createdAt),
                            "dd-MM-yyyy HH:mm"
                          )
                        : "-"}
                    </p>
                  </div>
                </div>
                {selectedUser.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Description
                    </label>
                    <p className="text-lg">{selectedUser.description}</p>
                  </div>
                )}
                {selectedUser.image && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Profile Image
                    </label>
                    <img
                      src={selectedUser.image}
                      alt="Profile"
                      className="w-32 h-32 object-cover rounded-lg mt-2"
                    />
                  </div>
                )}
              </div>
            )}
          </DialogContent>
          <DialogActions className="bg-gray-50">
            <Button
              onClick={() => setViewDialogOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default HomePage;
