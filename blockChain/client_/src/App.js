import logo from './logo.svg';
import './App.css';
import Navbar from './component/Navbar';
import Welcome from './component/Welcome';
import Services from './component/Services';
import Transaction from './component/Transaction';
import Footer from './component/Footer';

function App() {
  return (
    <div className="min-h-screen">
     <div className='gradient-bg-welcome'>
      <Navbar/>
      <Welcome/>
     </div>
     <Services/>
     <Transaction/>
     <Footer/>
    </div>
  );
}

export default App;
