import React, { useState } from "react";
import {
  useFetchUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
} from "../features/useUsers";
import {
  Container,
  Box,
  Typography,
  Snackbar,
  Alert,
  Button,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { User, UserPayload } from "../features/types";

//--------------------------------------------------------------------

const Main: React.FC = () => {
  // MARK: State
  const [editingItem, setEditingItem] = useState<User | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // MARK: Hooks
  const {
    data: queryUsers,
    isLoading: isQueryLoading,
    error: userError,
  } = useFetchUsers({ limit: rowsPerPage, page: page + 1 });
  const allUsers = queryUsers?.results || [];
  const totalCount = queryUsers?.meta.totalCount || 0;

  const addUserMutation = useAddUser({
    onSuccess: () => {
      setSnackbarMessage("User added successfully");
      setOpenSnackbar(true);
    },
  });
  const updateUserMutation = useUpdateUser({
    onSuccess: () => {
      setSnackbarMessage("User updated successfully");
      setOpenSnackbar(true);
    },
  });
  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      setSnackbarMessage("User deleted successfully");
      setOpenSnackbar(true);
    },
  });

  // MARK: Effects

  const handleAddItem = () => {
    const randomNumber = Math.floor(Math.random() * 1000);
    const newUser: UserPayload = {
      name: `User ${randomNumber}`,
      email: `user${randomNumber}@gmail.com`,
      city: "Hanoi",
      role: "user",
    };
    addUserMutation.mutate(newUser);
  };

  const handleUpdateItem = (user: User) => {
    updateUserMutation.mutate(user);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: number) => {
    deleteUserMutation.mutate(id);
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  if (isQueryLoading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
        my={2}
      >
        <CircularProgress size={40} />
      </Box>
    );

  if (userError)
    return <Typography color="error">Error: {userError?.message}</Typography>;

  return (
    <>
      <Container maxWidth="md" sx={{ my: 2 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100%"
        >
          <Typography variant="h4" gutterBottom>
            User List
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            onClick={handleAddItem}
          >
            Add Product
          </Button>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Name</TableCell>
                  <TableCell sx={{ color: "white" }}>Email</TableCell>
                  <TableCell sx={{ color: "white" }}>City</TableCell>
                  <TableCell sx={{ color: "white" }}>Role</TableCell>
                  <TableCell sx={{ color: "white" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allUsers.map((user) => (
                  <TableRow key={user.id}>
                    {editingItem && editingItem.id === user.id ? (
                      <TextField
                        value={editingItem.name}
                        onChange={(e) =>
                          setEditingItem({ ...user, name: e.target.value })
                        }
                        sx={{
                          input: { color: "white" },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "white",
                            },
                            "&:hover fieldset": {
                              borderColor: "white",
                            },
                          },
                          marginBottom: 2,
                        }}
                      />
                    ) : (
                      <TableCell sx={{ color: "white" }}>{user.name}</TableCell>
                    )}

                    <TableCell sx={{ color: "white" }}>{user.email}</TableCell>
                    <TableCell sx={{ color: "white" }}>{user.city}</TableCell>
                    <TableCell sx={{ color: "white" }}>{user.role}</TableCell>
                    <TableCell>
                      {editingItem && editingItem.id === user.id ? (
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleUpdateItem(editingItem)}
                          >
                            Save
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => setEditingItem(null)}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      ) : (
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setEditingItem(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDeleteItem(user.id)}
                          >
                            Delete
                          </Button>
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              ".MuiTablePagination-root": {
                color: "white",
              },
              ".MuiTablePagination-selectLabel": {
                color: "white",
              },
              ".MuiTablePagination-select": {
                color: "white",
              },
              ".MuiTablePagination-displayedRows": {
                color: "white",
              },
              ".MuiTablePagination-selectIcon": {
                color: "white",
              },
              ".MuiIconButton-root": {
                color: "white",
                "&.Mui-disabled": {
                  color: "rgba(255, 255, 255, 0.3)",
                },
              },
              ".MuiSelect-icon": {
                color: "white",
              },
            }}
          />
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Main;
