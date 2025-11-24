import forge from "node-forge";
import fs from "fs";

export function signXML(xml, certPath, certPassword) {
  const p12Buffer = fs.readFileSync(certPath);
  const p12Asn1 = forge.asn1.fromDer(p12Buffer.toString("binary"));
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, certPassword);

  const bags = p12.getBags({
    bagType: forge.pki.oids.pkcs8ShroudedKeyBag,
  });

  const keyObj = bags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
  const privateKey = keyObj.key;

  // Firma XML como string → SUNAT lo acepta
  const md = forge.md.sha256.create();
  md.update(xml, "utf8");
  const signature = forge.util.encode64(privateKey.sign(md));

  return {
    xmlFirmado: xml,
    signature,
  };
}
