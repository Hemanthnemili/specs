import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, title, rating, brand, price} = productDetails

  return (
    <li>
      <img src={imageUrl} alt={title} className="sim-img" />
      <h1>{title}</h1>
      <p>by {brand}</p>
      <div>
        <p>Rs.{price}</p>
        <div>
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
