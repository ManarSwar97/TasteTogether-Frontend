import { useNavigate } from 'react-router-dom'
import '../stylesheet/Home.css'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const Home = () => {
  const navigate = useNavigate()

  return (
    <>
      <nav className="navbar">
        <div
          className="navbar-logo"
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            userSelect: 'none'
          }}
        >
          <DotLottieReact
            src="https://lottie.host/78af1bf8-5fba-49a0-a4a7-590e5ca15610/e60pqZDJ5z.lottie"
            loop
            autoplay
            style={{ width: '60px', height: '60px' }}
          />
          <span>Taste Together</span>
        </div>
        <div className="navbar-links">
          <button onClick={() => navigate('/restaurants')} className="nav-btn">
            Restaurants
          </button>
          <button onClick={() => navigate('/recipes')} className="nav-btn">
            Recipes
          </button>
        </div>
      </nav>

      <main className="page-home">
        <div className="col home">
          <h1 className="home-title">TASTE TOGETHER</h1>
          <p className="home-subtitle">
            Because food tastes better when we share it together!
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
      </main>
    </>
  )
}

export default Home
