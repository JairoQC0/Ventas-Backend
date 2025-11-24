import axios from "axios";

export async function sendInvoice(xml, settings) {
  const url =
    settings.modo === "beta"
      ? "https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService"
      : "https://e-factura.sunat.gob.pe/ol-ti-itcpfegem/billService";

  const body = {
    fileName: `${settings.ruc}-F001-${Date.now()}.xml`,
    contentFile: Buffer.from(xml).toString("base64"),
  };

  const headers = {
    "Content-Type": "application/json",
    Authorization:
      "Basic " +
      Buffer.from(
        `${settings.sunat_username}:${settings.sunat_password}`
      ).toString("base64"),
  };

  const res = await axios.post(url, body, { headers });
  return res.data;
}
