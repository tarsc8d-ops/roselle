import { nutritionByPhase } from '../utils/nutritionData'

export default function NutritionCard({ phase }) {
  const data = nutritionByPhase[phase]
  if (!data) return null

  return (
    <div className="nutrition-card">
      <div className="nutrition-header">
        <span className="nutrition-icon">{data.icon}</span>
        <div>
          <h3>{data.title}</h3>
          <p className="nutrition-subtitle">{data.subtitle}</p>
        </div>
      </div>
      <p className="nutrition-description">{data.description}</p>
      <div className="nutrition-categories">
        {data.categories.map(cat => (
          <div key={cat.name} className="nutrition-category">
            <div className="category-header">
              <span>{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </div>
            <div className="category-items">
              {cat.items.map(item => (
                <span key={item} className="food-tag">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}