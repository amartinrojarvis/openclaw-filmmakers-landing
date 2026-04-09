const {BetaAnalyticsDataClient} = require('@google-analytics/data');
const path = require('path');

// Configuración
const PROPERTY_ID = '531817505';
const CREDENTIALS_PATH = path.join(__dirname, '..', '.ga4-service-account.json');

async function getBasicReport() {
  const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: CREDENTIALS_PATH,
  });

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '7daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'date',
        },
      ],
      metrics: [
        {
          name: 'sessions',
        },
        {
          name: 'activeUsers',
        },
        {
          name: 'newUsers',
        },
        {
          name: 'screenPageViews',
        },
        {
          name: 'averageSessionDuration',
        },
      ],
    });

    console.log('📊 REPORTE GA4 - Últimos 7 días\n');
    console.log('=' .repeat(60));
    
    if (response.rows.length === 0) {
      console.log('\n⚠️  No hay datos en los últimos 7 días');
      console.log('   Esto es normal si acabas de instalar GA4 (tarda 24-48h)');
      return;
    }

    let totalSessions = 0;
    let totalUsers = 0;
    let totalPageViews = 0;

    for (const row of response.rows) {
      const date = row.dimensionValues[0].value;
      const sessions = parseInt(row.metricValues[0].value);
      const activeUsers = parseInt(row.metricValues[1].value);
      const newUsers = parseInt(row.metricValues[2].value);
      const pageViews = parseInt(row.metricValues[3].value);
      const avgDuration = parseFloat(row.metricValues[4].value);

      totalSessions += sessions;
      totalUsers += activeUsers;
      totalPageViews += pageViews;

      console.log(`\n📅 ${date}`);
      console.log(`   Sesiones: ${sessions}`);
      console.log(`   Usuarios activos: ${activeUsers}`);
      console.log(`   Nuevos usuarios: ${newUsers}`);
      console.log(`   Páginas vistas: ${pageViews}`);
      console.log(`   Duración media: ${Math.round(avgDuration)}s`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📈 TOTALES (últimos 7 días):');
    console.log(`   Total sesiones: ${totalSessions}`);
    console.log(`   Total usuarios: ${totalUsers}`);
    console.log(`   Total páginas vistas: ${totalPageViews}`);

  } catch (error) {
    console.error('❌ Error al consultar GA4:', error.message);
    console.log('\nPosibles causas:');
    console.log('- La API de Google Analytics Data no está habilitada en el proyecto Cloud');
    console.log('- La cuenta de servicio no tiene permisos en la propiedad GA4');
    console.log('- El Property ID es incorrecto');
    process.exit(1);
  }
}

// Reporte de fuentes de tráfico
async function getTrafficSources() {
  const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: CREDENTIALS_PATH,
  });

  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'sessionDefaultChannelGroup',
        },
      ],
      metrics: [
        {
          name: 'sessions',
        },
        {
          name: 'activeUsers',
        },
      ],
      orderBys: [
        {
          metric: {
            metricName: 'sessions',
          },
          desc: true,
        },
      ],
    });

    console.log('\n\n🌐 FUENTES DE TRÁFICO (últimos 30 días)\n');
    console.log('=' .repeat(60));
    
    if (response.rows.length === 0) {
      console.log('\n⚠️  No hay datos de fuentes de tráfico');
      return;
    }

    for (const row of response.rows) {
      const channel = row.dimensionValues[0].value;
      const sessions = parseInt(row.metricValues[0].value);
      const users = parseInt(row.metricValues[1].value);

      console.log(`\n${channel}:`);
      console.log(`   Sesiones: ${sessions}`);
      console.log(`   Usuarios: ${users}`);
    }

  } catch (error) {
    console.error('\n❌ Error al consultar fuentes:', error.message);
  }
}

// Ejecutar reportes
(async () => {
  console.log('\n🔍 Consultando Google Analytics 4...\n');
  await getBasicReport();
  await getTrafficSources();
  console.log('\n✅ Reporte completado\n');
})();
