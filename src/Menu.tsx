import { Link } from "@chakra-ui/react";
import { Button } from "../src/components/ui/button";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "../src/components/ui/menu";

const Menu = () => {
  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Button variant="surface" size="md">
          Zone
        </Button>
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="new-file">
          <Link href="/rogerspass">Rogers Pass</Link>
        </MenuItem>
        <MenuItem value="new-file">
          <Link href="/grandteton">Grand Teton</Link>
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};

export default Menu;
