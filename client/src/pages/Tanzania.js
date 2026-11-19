import React from 'react';
import CountryClimatePage from './CountryClimatePage';

const Tanzania = () => (
  <CountryClimatePage
    flag="🇹🇿"
    name="Tanzania"
    season="Masika / vuli watch"
    subtitle="Live climate monitoring for Tanzania's agricultural and urban regions"
    cities={[
      { key: 'dodoma', label: 'Dodoma - Capital City Monitor', featured: true },
      { key: 'dar', label: 'Dar es Salaam - Economic Hub' },
    ]}
    beltTitle="Southern Highlands Agricultural Belt"
    beltCity="dodoma"
    regions={[
      { title: 'Southern Highlands', body: 'Main crops: Coffee, tea, pyrethrum' },
      { title: 'Northern Zone', body: 'Main crops: Maize, wheat, beans' },
      { title: 'Lake Zone', body: 'Main crops: Cotton, rice, cassava' },
      { title: 'Coastal Zone', body: 'Main crops: Coconut, cashew, sisal' },
    ]}
  />
);

export default Tanzania;
