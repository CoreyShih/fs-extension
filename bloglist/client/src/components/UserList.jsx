import { useQuery } from "@tanstack/react-query";
import userService from "../services/users";
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

  return (
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
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserList;
