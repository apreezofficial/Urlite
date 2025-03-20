import SvgIcons from "./icons/SvgIcons";

const Nav = () => {
  return (
      <nav className="flex justify-between items-center py-5 px-8 fixed top-0 left-0 right-0 z-50">
        <h3 className="text-[1.4rem] font-bold">LinkLite.</h3>
        <a href="https://github.com/TreasureUzoma/Link-Lite" target="_blank">
          <SvgIcons type="github" width="24px" height="24px"/>
        </a>
      </nav>
    )
}
export default Nav;