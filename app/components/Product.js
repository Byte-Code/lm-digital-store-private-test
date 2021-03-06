import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map, fromJS } from 'immutable';
import glamorous from 'glamorous';
import throttle from 'lodash/throttle';
import inRange from 'lodash/inRange';

import ImageSlider from './ImageSlider';
import ProductInfo from './ProductInfo';
import ProductInfoBadge from './ProductInfoBadge';
import SimilarProducts from './SimilarProducts';
import ScrollableDiv from './ScrollableDiv';


export default class Product extends Component {
  static propTypes = {
    params: PropTypes.shape({
      productCode: PropTypes.string.isRequired
    }).isRequired,
    productInfo: ImmutablePropTypes.map,
    requestFetchProduct: PropTypes.func.isRequired,
    clearProductList: PropTypes.func.isRequired,
    setAnalyticsProductClick: PropTypes.func.isRequired,
    similarProducts: ImmutablePropTypes.list.isRequired,
    hasNearbyStores: PropTypes.bool.isRequired
  };

  static defaultProps = {
    productInfo: Map()
  };

  constructor(props) {
    super(props);
    this.throttleValue = 500;
    this.onScrolling = this.onScrolling.bind(this);
    this.setScrollValue = this.setScrollValue.bind(this);
    this.renderAnimatedTitle = this.renderAnimatedTitle.bind(this);
    this.getOpacity = this.getOpacity.bind(this);
    this.state = {
      scrollValue: 0
    };
  }

  componentDidMount() {
    const { params: { productCode }, requestFetchProduct } = this.props;
    requestFetchProduct(productCode);
  }

  componentWillReceiveProps(nextProps) {
    const prevProductCode = this.props.params.productCode;
    const { params: { productCode }, requestFetchProduct } = nextProps;

    if (prevProductCode !== productCode) {
      requestFetchProduct(productCode);
    }
  }

  componentWillUnmount() {
    this.props.clearProductList();
  }


  onScrolling(scrollValue) {
    this.setScrollValue(scrollValue);
  }

  setScrollValue(scrollValue) {
    (throttle(() => {
      this.setState({ scrollValue });
    }, this.throttleValue))();
  }

  getOpacity() {
    const { scrollValue } = this.state;
    let opacity = 1;

    if (this.state.scrollValue) {
      if (inRange(scrollValue, 1, 400)) opacity = 0.75;
      if (inRange(scrollValue, 401, 600)) opacity = 0.5;
      if (inRange(scrollValue, 601, 1078)) opacity = 0.25;
      if (inRange(scrollValue, 1079, 2000)) opacity = 0;
    }
    return opacity;
  }

  renderSimilarProducts() {
    const { similarProducts, productInfo } = this.props;

    if (similarProducts.isEmpty()) {
      return null;
    }

    const relatedProd = productInfo.get('similarProducts');

    return relatedProd.map(sp => {
      const products = similarProducts.filter(p => sp.get('products').includes(p.get('code')));
      return (
        <SimilarProducts
          key={sp.get('name')}
          similarProducts={products}
          title={sp.get('name')}
          setAnalyticsProductClick={this.props.setAnalyticsProductClick}
        />
      );
    });
  }

  renderAnimatedTitle(config) {
    const { name, code } = config;
    const isShadowBox = this.state.scrollValue >= 1100;
    return (
      isShadowBox ?
        <FixedTitleWrapper>
          <Title>{name}</Title>
          <Ref>{`REF. ${code}`}</Ref>
        </FixedTitleWrapper> : <div />
    );
  }


  render() {
    const { productInfo, hasNearbyStores } = this.props;

    if (productInfo.isEmpty()) {
      return null;
    }

    const name = productInfo.get('name');
    const code = productInfo.get('code');
    const slug = productInfo.get('slug');
    const productType = productInfo.getIn(['productDetail', 'descriptionType']);
    const marketingDescriptions = productInfo.getIn(['productDetail', 'marketingDescriptions']);
    const marketingAttributes = productInfo.get('marketingAttributes');
    const loyaltyProgram = productInfo.get('loyaltyProgram');
    const descriptions = productInfo.getIn(['productDetail', 'descriptions']);
    const price = productInfo.getIn(['price', 'selling']);
    const pricingInfo = productInfo.get('pricingInformations');
    const currentStoreStock = fromJS({
      storeStock: productInfo.get('storeStock'),
      stockStatus: productInfo.getIn(['productStockInfo', 'vendibilityValue'])
    });
    const imageIDList = productInfo.get('images');
    const imageOptions = { width: 1080, height: 1080, crop: 'fit' };

    return (
      <Wrapper>
        <ScrollableDiv onScrolling={this.onScrolling}>
          <Title>{name}</Title>
          <Ref>{`REF. ${code}`}</Ref>
          {this.renderAnimatedTitle({ name, code })}
          <SliderWrapper opacity={this.getOpacity()}>
            <ImageSlider imageIDList={imageIDList} imageOptions={imageOptions} alt={name} />
          </SliderWrapper>
          <ProductInfo
            productType={productType}
            marketingDescriptions={marketingDescriptions}
            descriptions={descriptions}
          />
          <SimilarProductsWrapper>
            {this.renderSimilarProducts()}
          </SimilarProductsWrapper>
          <PriceWrapper>
            <ProductInfoBadge
              productName={name}
              productCode={code}
              productSlug={slug}
              pricingInfo={pricingInfo}
              currentStoreStock={currentStoreStock}
              marketingAttributes={marketingAttributes}
              loyaltyProgram={loyaltyProgram}
              price={price}
              scrollValue={this.state.scrollValue}
              hasNearbyStores={hasNearbyStores}
            />
          </PriceWrapper>
        </ScrollableDiv>
      </Wrapper>
    );
  }
}

const Wrapper = glamorous.div({
  position: 'relative'
});

const Title = glamorous.h1({
  padding: '40px 100px 0',
  textAlign: 'center',
  fontSize: 48,
  lineHeight: '70px',
  textTransform: 'capitalize'
});

const Ref = glamorous.h3({
  textTransform: 'uppercase',
  fontSize: 16,
  lineHeight: '24px',
  textAlign: 'center',
  marginBottom: 16
});

const SliderWrapper = glamorous.div(({ opacity }) => ({
  width: '100%',
  opacity
}));

const PriceWrapper = glamorous.div({
  position: 'fixed',
  right: '2%',
  top: '12%'
});

const SimilarProductsWrapper = glamorous.div({
  margin: '60px 0 0',
  '&>div': {
    marginBottom: 80
  }
});

const FixedTitleWrapper = glamorous.div({
  width: '100%',
  backgroundColor: 'white',
  boxShadow: '0px 6px 5px #888888',
  zIndex: 1,
  position: 'fixed',
  top: '0px'
});
