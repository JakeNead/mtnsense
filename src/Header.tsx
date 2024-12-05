import { Link } from "react-router";
import Menu from "./Menu";

const Header = function () {
  return (
    <header>
      <Menu />
      {/* <Link to="/rogerspass">Rogers Pass</Link>
      <Link to="/grandteton">Grand Teton</Link> */}
      <h1>MtnSense Forecasts</h1>
    </header>
  );
};

export default Header;
