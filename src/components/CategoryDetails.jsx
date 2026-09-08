function CategoryDetails({ category, onBack }) {

  const categoryTypes = {
    'Mosquito Beds': [
      {
        name: 'Red MSQ Bed',
        description: 'Red mosquito bed',
        image: '/products/mosquito-bed/red msq bed.jpg',
      },
      {
        name: 'White MSQ Bed',
        description: 'White mosquito bed',
        image: '/products/mosquito-bed/white msq bed.jpg',
      },
    ],

    'Baby Playgyms': [
      {
        name: 'Micky Playgym',
        description: 'Micky design baby playgym',
        image: '/products/baby-playgyms/big-baby-playgyms/micky playgym.jpg',
      },
      {
        name: 'Blue Playgyms',
        description: 'Blue design baby playgym',
        image: '/products/baby-playgyms/big-baby-playgyms/blue playgym.jpg',
      },
      {
        name: 'Peach Playgyms',
        description: 'Peach design baby playgym',
        image: '/products/baby-playgyms/big-baby-playgyms/peach playgym.jpg',
      },
    ],

    'Baby Tricycle': [
      {
        name: 'Mint & Black Tri',
        description: 'Mint and black baby tricycle',
        image: '/products/baby-tricycles/mint-black-tri.jpg',
      },
      {
        name: 'Black Tri',
        description: 'Black baby tricycle',
        image: '/products/baby-tricycles/black-tri.jpg',
      },
      {
        name: 'Blue & White Tri',
        description: 'Blue and white baby tricycle',
        image: '/products/baby-tricycles/blue-white-tri.jpg',
      },
      {
        name: 'Black & Pink Tri',
        description: 'Black and pink baby tricycle',
        image: '/products/baby-tricycles/black-pink-tri.jpg',
      },
      {
        name: 'Pink & Black Tri',
        description: 'Pink and black baby tricycle',
        image: '/products/baby-tricycles/pink-black-tri.jpg',
      },
      {
        name: 'Orange & Black Tri',
        description: 'Orange and black baby tricycle',
        image: '/products/baby-tricycles/orange-black-tri.jpg',
      },
    ],
    'Baby Bullets': [
      {
        name: 'Mint & Black Bullet',
        description: 'Mint and black baby bullet',
        image: '/products/baby-bullets/mint-and-black-bullet.jpg',
      },
      {
        name: 'Red & Black Bullet',
        description: 'Red and black baby bullet',
        image: '/products/baby-bullets/red-and-black-bullet.jpg',
      },
      {
        name: 'Blue & Black Bullet',
        description: 'Blue and black baby bullet',
        image: '/products/baby-bullets/blue-and-black-bullet.jpg',
      },
    ],

    'Baby Walker': [
      {
        name: 'Pink & Grey Walker',
        description: 'Pink and grey baby walker',
        image: '/products/baby-walkers/pink and grey walker.jpg',
      },
      {
        name: 'Mint & Grey Walker',
        description: 'Mint and grey baby walker',
        image: '/products/baby-walkers/mint and grey walker.jpg',
      },
      {
        name: 'Yellow Walker',
        description: 'Yellow baby walker',
        image: '/products/baby-walkers/yellow walker.jpg',
      },
      {
        name: 'Blue Walker',
        description: 'Blue baby walker',
        image: '/products/baby-walkers/blue walker.jpg',
      },
    ],
    'Ride On Toys': [
      {
        name: 'Yellow Horse',
        description: 'Yellow horse ride-on toy',
        image: '/products/ride-on-toys/yellow horse.jpg',
      },
      {
        name: 'Yellow Dragon',
        description: 'Yellow dragon ride-on toy',
        image: '/products/ride-on-toys/yellow dragon.jpg',
      },
      {
        name: 'Mint Horse',
        description: 'Mint horse ride-on toy',
        image: '/products/ride-on-toys/mint horse.jpg',
      },
      {
        name: 'Pink Car',
        description: 'Pink car ride-on toy',
        image: '/products/ride-on-toys/pink car.jpg',
      },
      {
        name: 'Red Elephant',
        description: 'Red elephant ride-on toy',
        image: '/products/ride-on-toys/red elephant.jpg',
      },
      {
        name: 'Pink Horse',
        description: 'Pink horse ride-on toy',
        image: '/products/ride-on-toys/pink horse.jpg',
      },
    ],

    'Swings': [
      {
        name: 'Black Red Swing',
        description: 'Black and red baby swing',
        image: '/products/swings/black red swing.jpg',
      },
      {
        name: 'Bright Red Swing',
        description: 'Bright red baby swing',
        image: '/products/swings/bright red swing.jpg',
      },
      {
        name: 'Mint Swing',
        description: 'Mint baby swing',
        image: '/products/swings/mint swing.jpg',
      },
    ],

    'Sleeping Bags': [
      {
        name: 'Mint Baby Nest',
        description: 'Mint baby nest',
        image: '/products/sleeping-bags/mint baby nest.jpg',
      },
      {
        name: 'Pink Baby Nest',
        description: 'Pink baby nest',
        image: '/products/sleeping-bags/pink baby nest.jpg',
      },
      {
        name: 'Red Baby Nest',
        description: 'Red baby nest',
        image: '/products/sleeping-bags/red baby nest.jpg',
      },
      {
        name: 'Black Stars Nest',
        description: 'Black stars baby nest',
        image: '/products/sleeping-bags/black stars nest.jpg',
      },
    ],

    'Sleeping Swings': [
      {
        name: 'Red Sleeping Swing',
        description: 'Red sleeping swing for babies',
        image: '/products/sleeping-swings/red sleeping swing.jpg',
      },
      {
        name: 'Rainbow Sleeping Swing',
        description: 'Rainbow sleeping swing for babies',
        image: '/products/sleeping-swings/rainbow sleeping swing.jpg',
      },
    ],
  }

  const types = categoryTypes[category.name] || []

  return (
    <section className="category-details">

      <button className="back-btn" onClick={onBack}>
        ← Back to Categories
      </button>

      <div className="category-details-heading">
        <p>EXPLORE</p>

        <h2>{category.name}</h2>

        <span>{category.description}</span>
      </div>

      <div className="category-options">

        {types.map((type) => (
          <div className="option-card" key={type.name}>

            <div className="option-image">
              <img
                src={type.image}
                alt={type.name}
              />
            </div>

            <h3>{type.name}</h3>

            <p>{type.description}</p>

          </div>
        ))}

      </div>

    </section>
  )
}

export default CategoryDetails