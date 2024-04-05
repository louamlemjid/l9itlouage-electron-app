function currentYear(){
    return new Date().getFullYear();
}
const Footer=()=>{
    return(<footer>
      <ul className="nav justify-content-center border-bottom border-top pb-3 mb-3">
        <li className="nav-item"><a href="#" className="nav-link px-2 text-dark">Home</a></li>
        <li className="nav-item"><a href="#" className="nav-link px-2 text-dark">Features</a></li>
        <li className="nav-item"><a href="#" className="nav-link px-2 text-dark">Pricing</a></li>
        <li className="nav-item"><a href="#" className="nav-link px-2 text-dark">FAQs</a></li>
        <li className="nav-item"><a href="#" className="nav-link px-2 text-dark">About</a></li>
      </ul>
      <p className="text-center fs-4 text-dark">L9itLouage © {currentYear()}, Inc</p>
  
    </footer>)
}
export default Footer;


