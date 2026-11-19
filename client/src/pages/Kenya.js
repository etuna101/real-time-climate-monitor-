import React from 'react';
import CountryClimatePage from './CountryClimatePage';

const Kenya = () => (
  <CountryClimatePage
    flag="🇰🇪"
    name="Kenya"
    season="Long / short rains watch"
    subtitle="Live climate monitoring for Kenya's agricultural and urban regions"
    cities={[{ key: 'nairobi', label: 'Nairobi - Capital City Monitor', featured: true }]}
    beltTitle="Central Highlands Agricultural Belt"
    beltCity="nairobi"
    regions={[
      { title: 'Central Highlands', body: 'Main crops: Tea, coffee, maize, beans' },
      { title: 'Rift Valley', body: 'Main crops: Wheat, barley, pyrethrum' },
      { title: 'Western Region', body: 'Main crops: Sugarcane, maize' },
      { title: 'Coastal Region', body: 'Main crops: Coconut, cashew nuts' },
    ]}
  />
);

export default Kenya;
