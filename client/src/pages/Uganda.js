import React from 'react';
import CountryClimatePage from './CountryClimatePage';

const Uganda = () => (
  <CountryClimatePage
    flag="🇺🇬"
    name="Uganda"
    season="Rainy season watch"
    subtitle="Live climate monitoring for Uganda's agricultural and urban regions"
    cities={[{ key: 'kampala', label: 'Kampala - Capital City Monitor', featured: true }]}
    beltTitle="Central Region Agricultural Belt"
    beltCity="kampala"
    regions={[
      { title: 'Central Region', body: 'Main crops: Banana, coffee, maize' },
      { title: 'Eastern Region', body: 'Main crops: Coffee, cotton, millet' },
      { title: 'Western Region', body: 'Main crops: Tea, banana, beans' },
      { title: 'Northern Region', body: 'Main crops: Sorghum, millet, cassava' },
    ]}
  />
);

export default Uganda;
