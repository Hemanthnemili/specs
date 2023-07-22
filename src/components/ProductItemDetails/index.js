import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productData: {},
    apiStatus: apiStatusConstants.initial,
    similarProductsData: [],
    quantity: 1,
  }

  componentDidMount() {
    this.getProductData()
  }

  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    price: data.price,
    description: data.description,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
  })

  getProductData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      header: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data)
      const updatedSimilarProductsData = data.similar_products.map(
        eachProduct => this.getFormattedData(eachProduct),
      )
      this.setState({
        productData: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.ok === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="error view"
        className="failure-img"
      />
      <h1>Products not Found</h1>
      <Link to="/products">
        <button type="button">Continue Shopping</button>
      </Link>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#ffffff" height={80} width={80} />
    </div>
  )

  onDecrementQuantity = () => {
    const {quantity} = this.state

    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderSuccessView = () => {
    const {productData, quantity, similarProductsData} = this.state
    const {
      title,
      imageUrl,
      availability,
      rating,
      brand,
      price,
      description,
      totalReviews,
    } = productData

    return (
      <div className="success-view">
        <div className="success-container">
          <img src={imageUrl} alt={title} className="prod-img" />
          <div className="product">
            <h1 className="product-heading">{title}</h1>
            <p className="product-para">Rs.{price} /-</p>
            <div className="rating-review-cont">
              <div className="rating-cont">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="start"
                  className="rating-star"
                />
                <p className="reviews">{totalReviews} Reviews</p>
              </div>

              <p className="description">{description}</p>
              <div className="available-cont">
                <p>Available:</p>
                <p>{availability}</p>
              </div>

              <div className="brand-cont">
                <p>Brand:</p>
                <p>{brand}</p>
              </div>

              <hr />

              <div className="quantity-cont">
                <button
                  className="button"
                  onClick={this.onDecrementQuantity}
                  type="button"
                  data-testis="minus"
                >
                  <BsDashSquare />
                </button>

                <p>{quantity}</p>

                <button
                  className="button"
                  onClick={this.onIncrementQuantity}
                  type="button"
                  data-testid="plus"
                >
                  <BsPlusSquare />
                </button>
              </div>

              <button type="button">Add to Cart</button>
            </div>
          </div>

          <h1>Similar Products</h1>
          <ul>
            {similarProductsData.map(eachSimilar => (
              <SimilarProductItem
                productsDetails={eachSimilar}
                key={eachSimilar.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductDetails()}
      </>
    )
  }
}

export default ProductItemDetails
