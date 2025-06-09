import React from 'react'
import Nifipaymentheader from './nifipaymentheader/Nifipaymentheader'
import Nifipaymentpage1 from './nifipaymentpage1/Nifipaymentpage1'
import Nifipaymentpage2 from './nifipaymentpage2/Nifipaymentpage2'
import Nifipaymentpage3 from './Nifipaymentpage3/Nifipaymentpage3'
import Nifipaymentpage4 from './nifipaymentpage4/Nifipaymentpage4'
import Nifipaymentfooter from './footer/Nifipaymentfooter'

const Nifipaymentmain = () => {
  return (
    <div>
        <Nifipaymentheader />
        <Nifipaymentpage1 />
        <Nifipaymentpage2 />
        <Nifipaymentpage3 />
        <Nifipaymentpage4 />
        <Nifipaymentfooter />
    </div>
  )
}

export default Nifipaymentmain