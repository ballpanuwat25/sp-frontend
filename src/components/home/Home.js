import Header from '../header/Header'
import React from 'react'
import './Home.css'

function Home() {
    return (
        <div className='container-fluid vh-100'>
            <main className='home px-4'>
                <nav className='home__header mt-1'>
                    <Header />
                </nav>

                <div className='home__container pb-4'>
                    <div className='home__container home__container--left'>
                        <div className='home__text'>
                            <h1>Chemicals & <br /> Equipment</h1>
                            <p>Get all your laboratory chemicals & equipment here</p>
                            <button className='btn btn-primary'>Get Started</button>
                        </div>
                    </div>

                    <div className='home__container home__container--right'>
                        <div className='home__splineGroup'>
                            <div className='home__spline home__spline--microscope'>
                                microscopes
                            </div>
                            <div className='home__spline home__spline--glassware'>
                                glassware
                            </div>
                            <div className='home__spline home__spline--molecular'>
                                molecular
                            </div>
                            <div className='home__spline home__spline--marquee'>
                                marquee
                            </div>
                            <div className='home__spline home__spline--icon'>
                                icon
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Home