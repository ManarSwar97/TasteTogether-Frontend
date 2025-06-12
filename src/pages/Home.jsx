import { useNavigate } from 'react-router-dom'
import '../stylesheet/Home.css'
const Home = () => {
  let navigate = useNavigate()
  return (
    <div className="page-home">
      <div className="col home">
        <h1 className="home-title">TASTE TOGETHER</h1>
        <p className="home-subtitle">
          Because food tastes better when we share it together 🍽️ !
        </p>
        <section className="welcome-signin">
          <button
            className="btn start-testing"
            onClick={() => navigate('/register')}
          >
            Start Testing!
          </button>
          <button className="btn sign-in" onClick={() => navigate('/signin')}>
            Sign In
          </button>
        </section>
      </div>
    </div>
  )
}

export default Home
