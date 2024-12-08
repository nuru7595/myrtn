import './App.css';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Prayers from './components/Prayers.jsx';
import Studies from './components/Studies.jsx';
import React from './components/React.jsx';
import Python from './components/Python.jsx';

export default function App() {
  let date = new Date().getDate();
  let section;
  if(date % 2 == 0) {
    section = <Python />;
  } else {
    section = <React />;
  }
  return (
    <>
      <Header />
      <main className='container my-20'>
      <Prayers />
      <Studies />
      {section}
      </main>
      <Footer />
    </>
  )
}