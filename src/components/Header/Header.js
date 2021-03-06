import CartMini from "../CartMini/CartMini";
import HeaderCurrencySwither from "../HeaderCurrencySwitcher/HeaderCurrencySwither";
import client from "../../apollo";
import { changeCurrency, getCurrency, setCategory } from "../../actions/cart";
import { GET_CURRENCY_CATEGORY } from "../../services/queries";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

async function currencyLoader() {
  const { data } = await client.query({query: GET_CURRENCY_CATEGORY} );
  return data;
}

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {
      isCartVisible: false,
      symbols: [],
      categories: []
    };
    this.setCartVisible = this.setCartVisible.bind(this);
  }

  currencyChanger = (value) => {
    this.props.changeCurrency(value);
  };

  setCategoryName(value) {
    this.props.setCategory(value);
  }

  setCartVisible(event) {
    event.stopPropagation();
    this.setState({
      isCartVisible: !this.state.isCartVisible
    });
    this.props.setBlur();
  }

  async loadData() {
    const data = await currencyLoader();
    this.setState({
      symbols: data.currencies,
      categories: data.categories
    });
  }

  async componentDidMount() {
    await this.loadData();
  }

  render() {
    const { totalItemsInCart, currency, setBlur } = this.props,
      { symbols, categories } = this.state;

    return (
      <header className="header-wrapper">
        <div>
          { categories.map(item =>
            <nav
              key={ item.name }
              onClick={ (event) => { this.setCategoryName(event.target.textContent); } }
            >
              <Link to="/">{ item.name.toUpperCase() }</Link>
            </nav>
          ) }
        </div>
        <Link to="/"><span className="logo"></span></Link>
        <div className="switcher-cart-wrapper">
          <HeaderCurrencySwither
            symbols={ symbols }
            currency={ currency }
            currencyChanger={this.currencyChanger}
          />
          <div onClick={ (event) => this.setCartVisible(event) }>
            <span className="cart-icon"></span>
            { totalItemsInCart > 0 && <span className="cart-icon-total">{ totalItemsInCart }</span> }
          </div>
        </div>
        { this.state.isCartVisible &&
          <CartMini
            setCartVisible={ this.setCartVisible }
            setCategoryName={ null }
            setBlur={ setBlur }
          />
        }
      </header>
    );
  }
}

Header.propTypes = {
  setBlur: PropTypes.func,
  setCategoryName: PropTypes.func,
  changeCurrency: PropTypes.func,
  categoryName: PropTypes.string,
  symbols: PropTypes.array,
  totalItemsInCart: PropTypes.number,
  currency: PropTypes.string,
  setCategory: PropTypes.func
};

const mapStateToProps = (state) => {

  return {
    totalItemsInCart: state.totalItemsInCart,
    symbols: state.symbols,
    currency: state.currency,

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeCurrency: (value) => { dispatch(changeCurrency(value)); },
    getCurrency: (value) => { dispatch(getCurrency(value)); },
    setCategory: (value) => { dispatch(setCategory(value)); },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
