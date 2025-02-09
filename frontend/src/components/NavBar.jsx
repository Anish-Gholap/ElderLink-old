import { Link } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import "../css/navbar.css"

const NavBar = () => {
  const {logout} = useAuthContext()

  return (
    <nav className="navbar">
      <div className="logo">ElderLink</div>
      <ul className='nav-links'>
        <li><Link to="/events-management">Manage Events</Link></li>
        <li><button onClick={logout}>Logout</button></li>
      </ul>
    </nav>
  )
}

export default NavBar