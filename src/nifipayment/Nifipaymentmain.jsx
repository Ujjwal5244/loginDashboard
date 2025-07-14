import React from 'react'
import Nifipaymentheader from './nifipaymentheader/Nifipaymentheader'
import Nifipaymentpage1 from './nifipaymentpage1/Nifipaymentpage1'
import Nifipaymentpage2 from './nifipaymentpage2/Nifipaymentpage2'
import Nifipaymentpage3 from './Nifipaymentpage3/Nifipaymentpage3'
import Nifipaymentpage4 from './nifipaymentpage4/Nifipaymentpage4'
import Nifipaymentfooter from './footer/Nifipaymentfooter'
import Nifipaymentpage5 from './nifipaymentpage5/Nifipaymentpage5'

const Nifipaymentmain = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        <Nifipaymentheader />

        <main className="flex-grow">
            <Nifipaymentpage1 />
            <Nifipaymentpage2 />
            <Nifipaymentpage3 />
            <Nifipaymentpage4 />
             <Nifipaymentpage5 />
        </main>

        <Nifipaymentfooter />
    </div>
  )
}

export default Nifipaymentmain