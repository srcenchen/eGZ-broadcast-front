import { Divider } from "@fluentui/react-components";
import Logo from "/src/assets/logo.png";
function Header() {
  return (
    <div className="flex flex-col">
      <div className="flex mt-2 mb-2 lg:ml-24 ml-2">
        <img src={Logo} width={256}></img>
      </div>
      <Divider />
    </div>
  );
}

export default Header;
