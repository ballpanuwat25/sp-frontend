import Header from '../header/Header'
import React from 'react'
import './Home.css'

import Spline from '@splinetool/react-spline';

function Home() {
    return (
        <div className='container-fluid vh-100'>
            <main className='home'>
                <nav className='home__header mt-1'>
                    <Header />
                </nav>

                <div className='home__container pb-4'>
                    <div className='home__container home__container--left'>
                        <div className='home__text'>
                            <h1 className='home__title'>Empowering <br /> Tomorrow's Innovators
                            </h1>
                            <p className="home__subtitle mb-3">Seamlessly bridge the gap between student ingenuity and academic resources through our Chemical Disbursement System. Your graduation project, your convenience, our commitment.</p>
                            <button className='home__cta btn px-4 me-3'>Get Started</button>
                            <button className='home__cta home__cta--faq btn px-4'><span className='faq__highlight'>Frequently asked questions</span></button>
                        </div>
                    </div>

                    <div className='home__container home__container--right'>
                        <div className='home__splineGroup'>
                            <div className='home__spline home__spline--microscope'>
                                <Spline scene="https://prod.spline.design/7G8JsiZc4woQ6kF9/scene.splinecode" />
                            </div>
                            <div className='home__spline home__spline--glassware'>
                                <Spline scene="https://prod.spline.design/YS-FsYmftyzMwzpp/scene.splinecode" />
                            </div>
                            <div className='home__spline home__spline--molecular'>
                                <Spline scene="https://prod.spline.design/pvcvM6ZGPyhHxIAD/scene.splinecode" />
                            </div>
                            <div className='home__spline home__spline--marquee d-flex align-items-center justify-content-center'>
                                <ul class="wave-menu">
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ul>
                            </div>
                            <div className='home__spline home__spline--icon'>
                                <i class="fa-brands fa-react"></i>
                            </div>
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