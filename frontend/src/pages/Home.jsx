import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h2> Welcome to ElderLink </h2>
      <p> Login To Begin </p>
      <Link to="/login">
        <button>
          Login
        </button>
      </Link>
    </div>
  )
}

export default Home