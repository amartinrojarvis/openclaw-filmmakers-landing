#!/usr/bin/env node
/**
 * Reporte semanal de GA4 para enviar por Telegram
 * Uso: node ga4-cronjob.js
 */

const {BetaAnalyticsDataClient} = require('@google-analytics/data');
const path = require('path');

const PROPERTY_ID = '531817505';
const CREDENTIALS_PATH = path.join(__dirname, '..', '.ga4-service-account.json');

async function getWeeklyReport() {
  const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: CREDENTIALS_PATH,
  });

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [
      {
        startDate: '7daysAgo',
        endDate: 'today',
      },
    ],
    dimensions: [
      { name: 'date' },
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'newUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'conversions' }, // Eventos de conversión
    ],
  });

  let totalSessions = 0;
  let totalUsers = 0;
  let totalPageViews = 0;
  let avgDuration = 0;

  for (const row of response.rows) {
    totalSessions += parseInt(row.metricValues[0].value);
    totalUsers += parseInt(row.metricValues[1].value);
    totalPageViews += parseInt(row.metricValues[3].value);
    avgDuration += parseFloat(row.metricValues[4].value);
  }

  avgDuration = avgDuration / response.rows.length;

  return {
    sessions: totalSessions,
    users: totalUsers,
    pageViews: totalPageViews,
    avgDuration: Math.round(avgDuration),
  };
}

async function getTopPages() {
  const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: CREDENTIALS_PATH,
  });

  const [response] = await analyticsDataClient.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'pageTitle' }],
    metrics: [{ name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 5,
  });

  return response.rows.map(row => ({
    page: row.dimensionValues[0].value,
    views: parseInt(row.metricValues[0].value),
  }));
}

async function main() {
  try {
    const report = await getWeeklyReport();
    const topPages = await getTopPages();

    const output = `
📊 REPORTE SEMANAL - iaparafilmmakers.es

📈 Tráfico (últimos 7 días):
• Sesiones: ${report.sessions}
• Usuarios: ${report.users}  
• Páginas vistas: ${report.pageViews}
• Duración media: ${Math.round(report.avgDuration / 60)} min

🏆 Páginas más vistas:
${topPages.map((p, i) => `${i + 1}. ${p.page}: ${p.views} vistas`).join('\n')}

💡 Recomendación:
${report.sessions < 50 
  ? "El tráfico es bajo. Es hora de activar el plan de Instagram que preparamos."
  : "Buen tráfico. Analiza qué fuentes funcionan mejor."
}
    `.trim();

    console.log(output);
    
    // Aquí podríamos enviar por Telegram usando tu sistema
    // Por ahora lo imprimimos para que lo veas
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
