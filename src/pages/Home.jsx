import React, { useContext } from 'react';
import { CategContext } from '../context/Context';
import Card from '../components/Card';

export const Home = () => {
  const { categories } = useContext(CategContext);
  console.log(categories);
  
  return (
    <div 
      className="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 pt-5 mt-5" 
      style={{
        backgroundImage: 'url(https://res.cloudinary.com/myblogki2024/image/upload/v1736767588/ajzhmlxdqtavxc6dhfiv.jpg)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center center',
        backgroundAttachment: 'fixed',  // Optional: Keep the background fixed while scrolling
        minHeight: '100vh', // Ensure the container stretches to cover the entire height of the page
        padding: '0' // Remove default padding
      }}
    >
      {/* Title Section */}
      <h1 className="mb-4" style={{color: "white"}}>Fő oldal</h1>
      <p>Témák:</p>

      {/* Image Group Section */}
      <div className="d-flex justify-content-center flex-wrap">
        {categories && categories.map(obj => (
          <Card name={obj.name} url={obj.photoUrl} key={obj.id} />
        ))}
      </div>
      
      <footer className="bg-dark text-light py-4">
        <div className="container d-flex flex-column align-items-center text-center">
          {/* Profile Picture */}
          <img
            src="https://res.cloudinary.com/myblogki2024/image/upload/v1734095846/o1xjozecgea8vtwrfl1w.jpg" // Your profile picture URL
            alt="Profile"
            className="rounded-circle mb-3"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          <h5 className="mb-2">Kaszás István</h5>
          <p className="mb-3" style={{ maxWidth: "400px" }}>
          István vagyok, szenvedélyem az autók, a túrázás és a jó kávé. Programozóként dolgozom, és mindig örömmel tanulok új dolgokat a technológia világában. 
          Mindig nyitott vagyok az új kihívásokra és lehetőségekre!
          </p>
        </div>
      </footer>
    </div>
  );
};
