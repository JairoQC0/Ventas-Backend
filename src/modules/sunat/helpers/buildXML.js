import { create } from "xmlbuilder2";

export function buildInvoiceXML({ sale, items, settings }) {
  const xml = create({ version: "1.0", encoding: "UTF-8" })
    .ele("Invoice", {
      xmlns: "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
      "xmlns:cac":
        "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
      "xmlns:cbc":
        "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
    })
    .ele("cbc:ID")
    .txt(`F001-${sale.id}`)
    .up()
    .ele("cbc:IssueDate")
    .txt(sale.fecha.toISOString().split("T")[0])
    .up()
    .ele("cac:AccountingSupplierParty")
    .ele("cbc:CustomerAssignedAccountID")
    .txt(settings.ruc)
    .up()
    .up()
    .ele("cac:AccountingCustomerParty")
    .ele("cbc:CustomerAssignedAccountID")
    .txt("00000000") // cliente por defecto
    .up()
    .up()
    .ele("cac:LegalMonetaryTotal")
    .ele("cbc:PayableAmount", { currencyID: "PEN" })
    .txt(sale.total.toFixed(2))
    .up()
    .up();

  for (const item of items) {
    xml
      .ele("cac:InvoiceLine")
      .ele("cbc:ID")
      .txt(item.id.toString())
      .up()
      .ele("cbc:InvoicedQuantity")
      .txt(item.cantidad.toString())
      .up()
      .ele("cbc:LineExtensionAmount", { currencyID: "PEN" })
      .txt(item.subtotal.toFixed(2))
      .up()
      .ele("cac:Item")
      .ele("cbc:Description")
      .txt(item.product.nombre)
      .up()
      .up()
      .ele("cac:Price")
      .ele("cbc:PriceAmount", { currencyID: "PEN" })
      .txt(item.precioUnitario.toFixed(2))
      .up()
      .up()
      .up();
  }

  return xml.end({ prettyPrint: true });
}
