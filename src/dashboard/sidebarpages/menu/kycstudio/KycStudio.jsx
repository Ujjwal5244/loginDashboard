import React from 'react'
import CategoriesLayout from './kyccategory/CategoriesLayout'

const KycStudio = ({ darkMode }) => {
  console.log("Dark mode is:", darkMode); // <- Check this one
  return (
    <div>
      <CategoriesLayout darkMode={darkMode} />
    </div>
  )
}

export default KycStudio