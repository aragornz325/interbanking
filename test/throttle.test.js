import axios from 'axios';

const URL = 'http://localhost:3000/api/empresas/actividad'; // Cambiá el endpoint si querés probar otro
const REQUEST_COUNT = 10;

void (async () => {
  const responses = [];

  for (let i = 0; i < REQUEST_COUNT; i++) {
    try {
      const res = await axios.get(URL);
      console.log(`✅ Request ${i + 1}:`, res.status);
    } catch (err) {
      if (err.response) {
        console.log(
          `❌ Request ${i + 1} ERROR:`,
          err.response.status,
          err.response.data?.message,
        );
        responses.push(err.response.status);
      } else {
        console.log(`❌ Request ${i + 1} ERROR:`, err.message);
      }
    }
  }

  const tooMany = responses.filter((r) => r === 429).length;
  console.log(
    `\n🧾 Resultado: ${tooMany} solicitudes fueron bloqueadas por throttling.`,
  );
})();
