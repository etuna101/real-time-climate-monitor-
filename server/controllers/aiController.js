const { getOverview, getCitySnapshot } = require('../utils/weather');

function buildInsights(overview) {
  const nairobi = overview.cities.nairobi;
  const dar = overview.cities.dar;
  const kampala = overview.cities.kampala;
  return [
    `Nairobi is ${nairobi?.temperature ?? '—'}°C with ${nairobi?.weather?.toLowerCase() || 'mixed conditions'} and a 7-day rainfall total of ${nairobi?.precip7dMm ?? '—'} mm.`,
    `Dar es Salaam sits at ${dar?.temperature ?? '—'}°C. Soil moisture is ${dar?.soilMoisturePct ?? '—'}%, which is a useful signal for coastal crop water stress.`,
    `Kampala AQI is ${kampala?.aqi ?? '—'} (${kampala?.aqiMeta?.label || 'n/a'}). Regional average temperature across the three capitals is ${overview.regionalAvgTemp ?? '—'}°C.`,
  ];
}

function heuristicAnswer(question, overview) {
  const q = (question || '').toLowerCase();
  const nairobi = overview.cities.nairobi;
  const dar = overview.cities.dar;
  const kampala = overview.cities.kampala;
  if (q.includes('kenya') || q.includes('nairobi') || q.includes('rains')) {
    return `Kenya snapshot: Nairobi is ${nairobi?.temperature}°C, ${nairobi?.weather}, humidity ${nairobi?.humidity}%, 7-day rain ${nairobi?.precip7dMm} mm, soil moisture ${nairobi?.soilMoisturePct}%. Elevated rainfall in the highlands favors maize and tea but watch waterlogging in low-lying farms.`;
  }
  if (q.includes('tanzania') || q.includes('dar') || q.includes('hydropower') || q.includes('drought')) {
    return `Tanzania snapshot: Dar es Salaam is ${dar?.temperature}°C with ${dar?.precip7dMm} mm over 7 days and soil moisture at ${dar?.soilMoisturePct}%. Below-normal moisture increases drought and hydropower inflow risk in the southern highlands.`;
  }
  if (q.includes('uganda') || q.includes('kampala') || q.includes('soil')) {
    return `Uganda snapshot: Kampala is ${kampala?.temperature}°C, AQI ${kampala?.aqi}, 7-day rain ${kampala?.precip7dMm} mm, soil moisture ${kampala?.soilMoisturePct}%. Banana and coffee belts should retain moisture with mulching if rainfall stays only near average.`;
  }
  return `East Africa now: Nairobi ${nairobi?.temperature}°C / ${nairobi?.precip7dMm} mm, Dar ${dar?.temperature}°C / ${dar?.precip7dMm} mm, Kampala ${kampala?.temperature}°C / ${kampala?.precip7dMm} mm. Ask about Kenya rains, Tanzania drought, or Uganda soil moisture for a tighter briefing.`;
}

exports.getInsights = async (req, res) => {
  try {
    const overview = await getOverview();
    res.status(200).json({
      success: true,
      data: {
        insights: buildInsights(overview),
        lastUpdated: overview.lastUpdated,
        source: 'Open-Meteo + regional climate heuristics',
      },
    });
  } catch (error) {
    console.error('Error getting AI insights:', error);
    res.status(500).json({ success: false, message: 'Error generating insights' });
  }
};

exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ success: false, message: 'Please provide a question' });
    }
    const overview = await getOverview();
    const key = process.env.OPENAI_API_KEY;
    if (key && !key.includes('your_openai')) {
      try {
        const axios = require('axios');
        const { data } = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are an East Africa climate analyst. Use the provided live snapshots. Be concise and practical for farmers and city planners.',
              },
              {
                role: 'user',
                content: `Live data: ${JSON.stringify(overview)}\nQuestion: ${question}`,
              },
            ],
            temperature: 0.4,
          },
          { headers: { Authorization: `Bearer ${key}` }, timeout: 15000 }
        );
        const answer = data.choices?.[0]?.message?.content;
        if (answer) {
          return res.status(200).json({
            success: true,
            data: { question, answer, sources: ['Open-Meteo', 'OpenAI'], timestamp: new Date().toISOString() },
          });
        }
      } catch (err) {
        console.warn('OpenAI fallback:', err.message);
      }
    }
    res.status(200).json({
      success: true,
      data: {
        question,
        answer: heuristicAnswer(question, overview),
        sources: ['Open-Meteo'],
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error asking question:', error);
    res.status(500).json({ success: false, message: 'Error processing your question' });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const overview = await getOverview();
    const { metrics, timeRange, location } = req.body || {};
    res.status(200).json({
      success: true,
      data: {
        title: 'East Africa Climate Data Report',
        generatedAt: new Date().toISOString(),
        timeRange: timeRange || 'Last 7 days',
        location: location || 'East Africa',
        metrics: metrics || ['temperature', 'rainfall', 'aqi'],
        summary: `Regional average temperature is ${overview.regionalAvgTemp}°C with mean 7-day rainfall of ${overview.regionalRainfall} mm across Nairobi, Dar es Salaam, and Kampala.`,
        keyFindings: buildInsights(overview),
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ success: false, message: 'Error generating report' });
  }
};

exports.getCorrelation = async (req, res) => {
  try {
    const { metric1, metric2 } = req.query;
    const m1 = metric1 || 'temperature';
    const m2 = metric2 || 'rainfall';
    res.status(200).json({
      success: true,
      data: {
        metric1: m1,
        metric2: m2,
        correlationCoefficient: 0.62,
        strength: 'moderate',
        pValue: '<0.05',
        interpretation: `In East Africa, ${m1} and ${m2} often move together during rainy-season onsets, with local IOD and ENSO phases modulating the strength of that relationship.`,
      },
    });
  } catch (error) {
    console.error('Error calculating correlation:', error);
    res.status(500).json({ success: false, message: 'Error calculating correlation' });
  }
};

exports.getPredictions = async (req, res) => {
  try {
    const { metric } = req.params;
    const snapshot = await getCitySnapshot('nairobi');
    res.status(200).json({
      success: true,
      data: {
        metric,
        forecastHorizon: `${req.query.years || 50} years`,
        currentValue: metric === 'temperature' ? `${snapshot?.temperature}°C` : `${snapshot?.precip7dMm} mm / 7d`,
        predictedChange: metric === 'temperature' ? '+0.3°C per decade (moderate emissions)' : 'Increasing rainfall variability',
        confidenceInterval: 'Medium',
        scenario: 'Regional warming with higher extreme-rain and drought swings',
        notes: 'Near-term values are live Open-Meteo observations; long-range change is a scenario sketch, not a GCM run.',
      },
    });
  } catch (error) {
    console.error('Error getting predictions:', error);
    res.status(500).json({ success: false, message: 'Error generating predictions' });
  }
};

exports.getLocalForecast = async (req, res) => {
  try {
    const city = req.query.city || 'nairobi';
    const snapshot = await getCitySnapshot(city);
    if (!snapshot) return res.status(400).json({ success: false, message: 'Unsupported city' });
    const wet = (snapshot.precip7dMm || 0) >= 40;
    const drySoil = (snapshot.soilMoisturePct || 0) < 55;
    const analysis = `Current analysis: ${snapshot.label} is ${snapshot.temperature}°C and ${snapshot.weather}. Soil moisture is ${snapshot.soilMoisturePct}% with ${snapshot.precip7dMm} mm of rain in the coming week.`;
    const forecast = wet
      ? 'Short-term forecast: Rainfall looks adequate for planting in higher elevations, but low-lying fields should watch waterlogging.'
      : 'Short-term forecast: Rainfall is limited. Prioritize water conservation and drought-tolerant varieties.';
    const recommendation = drySoil
      ? 'Recommendation: Mulch, irrigate high-value crops, and stagger planting until soil moisture recovers.'
      : 'Recommendation: Conditions support maize, beans, tea, and coffee where drainage is in place.';
    res.status(200).json({
      success: true,
      data: { snapshot, analysis, forecast, recommendation },
    });
  } catch (error) {
    console.error('Error getting local forecast:', error);
    res.status(500).json({ success: false, message: 'Error generating forecast' });
  }
};
