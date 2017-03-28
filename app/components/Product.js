import React, { Component, PropTypes } from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';
import styled from 'styled-components';

import ImageSlider from './ImageSlider';
import ProductInfo from './ProductInfo';
import PriceBadge from './PriceBadge';

const Wrapper = styled.div`
  position: relative;
`;

const Title = styled.h1`
  margin: 40px 40px 0;
  text-align: center;
  font-size: 48px;
  line-height: 70px;
  text-transform: capitalize;
`;

const Ref = styled.h3`
  text-transform: uppercase;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  margin-bottom: 16px;
`;

const SliderWrapper = styled.div`
  width: 100%;
`;

const PriceWrapper = styled.div`
  position: absolute;
  right: 30px;
  top: 234px;
`;

export default class Product extends Component {
  static propTypes ={
    params: PropTypes.shape({
      productCode: PropTypes.string.isRequired
    }).isRequired,
    productInfo: ImmutablePropTypes.map,
    requestFetchProduct: PropTypes.func.isRequired
  }

  static defaultProps = {
    productInfo: Map()
  }

  componentDidMount() {
    const { params: { productCode }, requestFetchProduct } = this.props;
    requestFetchProduct(productCode);
  }

  render() {
    const { productInfo } = this.props;

    if (productInfo.isEmpty()) {
      return null;
    }

    const name = productInfo.get('name');
    const code = productInfo.get('code');
    const marketingDescriptions = productInfo.getIn(['productDetail', 'marketingDescriptions']);
    const descriptions = productInfo.getIn(['productDetail', 'descriptions']);
    const pricingInfo = productInfo.getIn(['price', 'selling']);
    const imageIDList = productInfo.get('images');
    const imageOptions = { width: 1080, height: 1080, crop: 'fit' };

    console.log(productInfo.toJS());

    return (
      <Wrapper>
        <Title>{name}</Title>
        <Ref>{`REF. ${code}`}</Ref>
        <SliderWrapper>
          <ImageSlider
            imageIDList={imageIDList}
            imageOptions={imageOptions}
            alt={name}
          />
        </SliderWrapper>
        <ProductInfo
          marketingDescriptions={marketingDescriptions}
          descriptions={descriptions}
        />
        <PriceWrapper>
          <PriceBadge pricingInfo={pricingInfo} />
        </PriceWrapper>
      </Wrapper>
    );
  }
}
