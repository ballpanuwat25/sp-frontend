import Header from '../header/Header'
import React from 'react'
import './Home.css'

import { Link } from 'react-router-dom';

import Spline from '@splinetool/react-spline';

function Home() {
    return (
        <div className='container-fluid vh-100'>
            <main className='home'>
                <nav className='home__header mt-1'>
                    <Header />
                </nav>

                <div className='home__container'>
                    <div className='home__container home__container--left'>
                        <div className='home__text'>
                            <p className='home__highlight'>Kasetsart University</p>
                            <h1 className='home__title'>Elevate Projects with  <br /> <i className="fa-solid fa-globe" /> Essential Materials</h1>
                            <p className='home__subtitle'>  Empowering Tomorrow's Innovators Seamlessly bridge the gap between student ingenuity and academic resources through our Chemical Disbursement System. Your graduation project, your convenience, our commitment.</p>
                            <Link to="https://forms.gle/7L4BApMbd9mfqaaq7" className='home__cta thai--font'>ทำแบบสอบถาม</Link>
                        </div>
                    </div>

                    <div className='home__container home__container--right'>
                        <div className='home__background'>
                            <Spline scene="https://prod.spline.design/pvcvM6ZGPyhHxIAD/scene.splinecode" />
                        </div>
                    </div>
                </div>

                <footer className='home__footer'>
                    <p>© 2023 Panuwat Pisavong | All rights reserved.</p>
                </footer>
            </main>
        </div>
    )
}

export default Home