import React, { useState, useEffect } from 'react'
import './Home.css'

const Home = () => {
  
  const [meals, setMeals] = useState([]);
  
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=a');
        const data = await response.json();
        setMeals(data.meals || []);
        console.log("API Response:", data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
  };
  fetchMeals();
}, []);
  
  return (
    <div className='card-container'>
      {meals.map((meal) => (
        <div key={meal.idMeal} className='id-of-card'>
          <h3>{meal.strMeal}</h3>
          <img src={meal.strMealThumb} alt={meal.strMeal} width='100' />
          </div>
))}
    </div>
  )
}

export default Home