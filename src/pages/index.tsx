import React from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Landing from '../sections/Landing';
import About from '../sections/About';
import Projects from '../sections/Projects';
import Footer from '../components/Footer';

const Home = () => (
  <Layout>
    <Header />
    <Landing />
    <About />
    <Projects />
    <Footer />
  </Layout>
);

export default Home;
