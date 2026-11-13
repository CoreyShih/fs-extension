import { Routes, Route, Link, useMatch } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";
import User from "./User";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const UserList = () => {
  const { data: users, isPending } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    select: (users) =>
      users.toSorted((a, b) => b.blogs.length - a.blogs.length),
    refetchOnWindowFocus: false,
  });

  const match = useMatch("/users/:id");

  if (isPending) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
        }}
      >
        <CircularProgress aria-label="Loading…" />
      </Box>
    );
  }

  const user = match ? users.find((user) => user.id === match.params.id) : null;

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Typography variant="h5" component="h2" sx={{ my: 1 }}>
                Users
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>Blogs created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <Link to={`/users/${user.id}`}>{user.name}</Link>
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.blogs.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          }
        />
        <Route path=":id" element={<User user={user} />} />
      </Routes>
    </div>
  );
};

export default UserList;
