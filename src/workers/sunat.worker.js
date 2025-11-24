import { redis } from "../config/redis.js";
import { sendInvoiceToSunat } from "../modules/sunat/sunat.service.js";

console.log("🚀 Worker SUNAT iniciado...");

async function processQueue() {
  while (true) {
    const job = await redis.brpop("sunat_queue", 0); // espera hasta obtener un job
    if (!job) continue;

    const data = JSON.parse(job[1]);

    try {
      console.log("📤 Reintentando enviar a SUNAT venta:", data.saleId);
      await sendInvoiceToSunat(data.saleId);
      console.log("✅ Enviado correctamente");
    } catch (err) {
      console.log("❌ Error reintentando envío:", err.message);

      // reinsertar al final para retardo
      await redis.lpush("sunat_queue", JSON.stringify(data));

      console.log("🔁 Reinsertado en cola...");
    }
  }
}

processQueue();
