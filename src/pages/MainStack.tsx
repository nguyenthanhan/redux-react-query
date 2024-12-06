import React, { useEffect, useMemo, useState } from "react";
import {
  useFetchUsers,
  useAddUser,
  useUpdateUser,
  useDeleteUser,
} from "../features/useUsers";
import {
  Button,
  Box,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  CircularProgress,
  Stack,
} from "@mui/material";
import { User, UserPayload } from "../features/types";
import { useInView } from "react-intersection-observer";

//--------------------------------------------------------------------

const MainStack: React.FC = () => {
  // MARK: Hooks
  const {
    data: queryUsers,
    isLoading: isQueryLoading,
    error: userError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFetchUsers({});
  const allUsers =
    queryUsers?.pages.flatMap((pageData) => pageData.results) || [];

  // Add intersection observer
  const { ref, inView } = useInView();

  // Trigger fetch when bottom is visible
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage]);

  const addUserMutation = useAddUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const [editingItem, setEditingItem] = useState<User | null>(null);

  const handleAddItem = () => {
    const newUser: UserPayload = {
      name: `User ${Math.floor(Math.random() * 100)}`,
      email: `user${Math.floor(Math.random() * 100)}@gmail.com`,
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
        <List sx={{ width: "100%" }}>
          {allUsers?.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "center", // Center horizontally
                alignItems: "center", // Center vertically
                flexDirection: "row", // Keep items in a row
                gap: 2, // Add spacing between items
              }}
            >
              {editingItem && editingItem.id === item.id ? (
                <>
                  <Stack spacing={1}>
                    <TextField
                      variant="outlined"
                      value={editingItem.name}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, name: e.target.value })
                      }
                    />
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ margin: 2 }}
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
                </>
              ) : (
                <>
                  <Stack spacing={1}>
                    <Typography>{item.name}</Typography>
                    <Typography>{item.email}</Typography>
                  </Stack>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ margin: 2 }}
                    onClick={() => setEditingItem(item)}
                  >
                    Change
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </ListItem>
          ))}

          {/* Loading trigger */}
          <Box ref={ref} sx={{ height: 20 }}>
            {isFetchingNextPage && (
              <CircularProgress size={30} sx={{ my: 2 }} />
            )}
          </Box>

          {/* End of list */}
          {!hasNextPage && (
            <Typography align="center" sx={{ my: 2 }}>
              No more users
            </Typography>
          )}
        </List>
      </Box>
    </Container>
  );
};

export default MainStack;
