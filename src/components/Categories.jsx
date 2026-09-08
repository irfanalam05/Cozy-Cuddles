import CircleStrip from './CircleStrip'
import { categories } from '../data/categories'
import { categoryPath } from '../router'

function Categories() {
  return (
    <section id="categories" className="circle-strip-section categories-section bg-deepblue">
      <div className="circle-strip-heading">
        <div className="cloud-heading">
          <img src="/logo/cloud-sign.png" alt="" className="cloud-heading-bg" />
          <h2>Categories</h2>
        </div>
      </div>

      <div className="circle-strip-bordered">
        <CircleStrip
          items={categories}
          onItemClick={(category) => {
            window.location.hash = categoryPath(category.name)
            window.scrollTo(0, 0)
          }}
        />
      </div>
    </section>
  )
}

export default Categories
