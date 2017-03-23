import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import styled from 'styled-components';

import Image from './Image';

const Wrapper = styled.div`
  height: 605px;
  width: 405px;
  color: #333333;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  &>div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 33px;
  }
`;

const Title = styled.div`
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  margin: 10px 0;
`;

const Name = styled.div`
  line-height: 32px;
  font-size: 20px;
  font-family: LeroyMerlinSans Bold;
  text-transform: uppercase;
  margin: 10px 0;
`;

const Price = styled.div`
  font-size: 16px;
  line-height: 20px;
  width: 100%;
  margin-top: auto;
  margin-bottom: 40px;
`;

const ProductBadge = ({ productInfo }) => {
  const imageID = productInfo.get('mainImage');
  const imageOptions = { width: 405, height: 405 };
  const name = productInfo.get('name');
  const title = 'FACILE DA RIPORRE';
  const price = productInfo.getIn(['price', 'selling', 'gross']).toFixed(2);
  const currency = productInfo.getIn(['price', 'currency']);
  const displayPrice = `${price} ${currency}`;

  return (
    <Wrapper>
      <Title>{title}</Title>
      <Image
        imageID={imageID}
        imageOptions={imageOptions}
        alt={name}
      />
      <Name>{name}</Name>
      <Price>{displayPrice}</Price>
    </Wrapper>
  );
};

ProductBadge.propTypes = {
  productInfo: ImmutablePropTypes.map.isRequired
};

export default ProductBadge;
