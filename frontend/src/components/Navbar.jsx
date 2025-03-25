import { Link } from "react-router-dom";
import { Group, Button } from "@mantine/core";

const Navbar = () => {
  return (
    <nav style={{ padding: "10px", background: "#1a1a2e" }}>
      <Group position="center" spacing="md">
        <Button variant="outline" color="white" component={Link} to="/">
          Home
        </Button>
        <Button variant="outline" color="white" component={Link} to="/login">
          Login
        </Button>
        <Button variant="outline" color="white" component={Link} to="/signup">
          Signup
        </Button>
        <Button variant="outline" color="white" component={Link} to="/profile">
          Profile
        </Button>
        <Button variant="outline" color="white" component={Link} to="/products">
          Products
        </Button>
        <Button variant="outline" color="white" component={Link} to="/stock">
          Stock
        </Button>
        <Button variant="outline" color="white" component={Link} to="/suppliers">
          Suppliers
        </Button>
      </Group>
    </nav>
  );
};

export default Navbar;