import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | FEROX BARF",
  description:
    "Términos y Condiciones de uso, compra, despacho, conservación y consumo responsable de productos FEROX BARF.",
};

const sections = [
  {
    title: "1. Introducción",
    body: [
      "Estos Términos y Condiciones regulan el uso del sitio web, canales digitales, productos, planes, pedidos y servicios asociados a FEROX BARF. Al navegar por el sitio, crear una cuenta, registrar información, publicar comentarios, solicitar productos o coordinar pedidos por canales oficiales, el usuario declara haber leído y aceptado estas condiciones.",
      "FEROX BARF promueve una alimentación natural y responsable para perros. La información publicada busca orientar al cliente, facilitar la compra y apoyar una transición alimentaria cuidadosa, sin reemplazar la evaluación profesional cuando corresponda.",
    ],
  },
  {
    title: "2. Identificación del servicio",
    body: [
      "FEROX BARF comercializa alimentación BARF para perros en Chile, junto con productos, planes mensuales, información orientativa, herramientas de cálculo, perfiles de usuario, registro de perros, comentarios y canales de contacto para pedidos o consultas.",
      "La venta y coordinación de pedidos puede realizarse mediante la web, WhatsApp, redes sociales oficiales u otros canales directos informados por FEROX.",
    ],
  },
  {
    title: "3. Uso del sitio web",
    body: [
      "El usuario debe utilizar el sitio de manera lícita, respetuosa y coherente con su finalidad. No está permitido usar la web para publicar contenido falso, ofensivo, engañoso, fraudulento, que afecte a terceros o que pueda dañar el funcionamiento del servicio.",
      "El usuario es responsable de la veracidad de los datos que ingrese, incluyendo información de contacto, dirección de entrega, perfil, mascotas registradas, comentarios y antecedentes relevantes para la coordinación de pedidos.",
    ],
  },
  {
    title: "4. Productos, precios y disponibilidad",
    body: [
      "Los productos, formatos, precios, planes, descuentos, costos de despacho y disponibilidad pueden variar según stock, comuna, fechas de entrega, volumen solicitado y confirmación previa. La información publicada en el sitio es referencial hasta que FEROX confirme el pedido por un canal oficial.",
      "FEROX puede actualizar productos, precios, promociones o disponibilidad sin aviso previo, procurando mantener la información comercial clara y actualizada.",
    ],
  },
  {
    title: "5. Pedidos y confirmación",
    body: [
      "Un pedido se considera confirmado solo cuando FEROX valida la solicitud, disponibilidad, datos de entrega, monto, forma de pago y coordinación correspondiente por un canal oficial. El envío de un mensaje por WhatsApp o redes sociales no garantiza por sí solo la reserva del producto.",
      "FEROX podrá solicitar información adicional para coordinar correctamente el pedido, especialmente datos de contacto, comuna, dirección, referencias de entrega o preferencias de producto.",
    ],
  },
  {
    title: "6. Pagos",
    body: [
      "Las formas de pago disponibles serán informadas por FEROX al momento de coordinar la compra. El pedido puede quedar sujeto a confirmación de pago, transferencia, comprobante o validación interna antes de su preparación o despacho.",
      "El cliente debe revisar que el monto pagado coincida con el pedido confirmado, incluyendo productos, planes, descuentos aplicables y despacho cuando corresponda.",
    ],
  },
  {
    title: "7. Despachos y entregas",
    body: [
      "Los despachos, horarios, comunas de cobertura y fechas de entrega dependen de disponibilidad, coordinación logística y confirmación previa. FEROX no promete horarios exactos salvo que hayan sido expresamente confirmados para un pedido específico.",
      "El cliente debe entregar datos correctos, estar disponible para recibir el producto y avisar oportunamente cualquier cambio que pueda afectar la entrega. Si la entrega no puede realizarse por información incorrecta, ausencia del receptor u otras circunstancias atribuibles al cliente, podrán coordinarse alternativas según disponibilidad.",
    ],
  },
  {
    title: "8. Cadena de frío y conservación",
    body: [
      "Los productos FEROX BARF requieren correcta manipulación, conservación y cadena de frío. Una vez entregado el producto, el cliente es responsable de mantenerlo en condiciones adecuadas, seguir las indicaciones de conservación y evitar exposiciones prolongadas a temperatura ambiente.",
      "FEROX no se hace responsable por pérdida de calidad, descongelamiento, mala manipulación, almacenamiento inadecuado o consumo fuera de las condiciones recomendadas después de la entrega al cliente o a la persona que recibe por él.",
    ],
  },
  {
    title: "9. Recepción del producto",
    body: [
      "Al recibir el producto, el cliente debe revisar el pedido, verificar que corresponda a lo solicitado y conservarlo de inmediato según las instrucciones recomendadas. Si detecta un problema visible en la entrega, debe informarlo a FEROX dentro de las 12 horas siguientes a la recepción.",
      "Para revisar adecuadamente un caso, FEROX podrá solicitar fotos, número o detalle de pedido, comprobante de pago, conversación de compra y antecedentes de conservación desde la recepción.",
    ],
  },
  {
    title: "10. Cambios, devoluciones y reembolsos",
    body: [
      "Por tratarse de productos alimenticios que requieren cadena de frío, los cambios, devoluciones o reembolsos se evaluarán caso a caso y solo procederán cuando exista un error comprobable atribuible directamente a FEROX, como entrega de un producto distinto al confirmado o una incidencia verificable previa a la recepción.",
      "No se aceptarán cambios o devoluciones por manipulación posterior, descongelamiento, almacenamiento inadecuado, demora en refrigerar, rechazo individual del perro, cambio de opinión o consumo fuera de las condiciones recomendadas.",
    ],
  },
  {
    title: "11. Productos perecibles",
    body: [
      "Los productos FEROX BARF son alimenticios y perecibles. Por razones sanitarias, de inocuidad y conservación, no se aceptan devoluciones una vez entregado el producto, salvo error comprobable atribuible directamente a FEROX.",
      "Cualquier problema debe reportarse dentro de las 12 horas siguientes a la recepción, adjuntando evidencia suficiente para analizar el caso de manera responsable.",
    ],
  },
  {
    title: "12. Compra directa a FEROX y canales oficiales",
    body: [
      "FEROX responde únicamente por productos adquiridos directamente a través de sus canales oficiales o por canales expresamente autorizados. Esto permite resguardar la conservación, trazabilidad, información entregada al cliente y experiencia de compra.",
      "Los canales oficiales pueden incluir el sitio web, WhatsApp oficial, redes sociales oficiales y otros medios informados directamente por FEROX.",
    ],
  },
  {
    title: "13. Revendedores, terceros e imitaciones",
    body: [
      "Si una persona compra a revendedores, terceros, intermediarios, cuentas no oficiales o personas ajenas a FEROX, la marca no se hace responsable por el estado del producto, conservación, manipulación, autenticidad, precio, entrega, experiencia de compra o información entregada por ese tercero.",
      "Esta regla aplica incluso si el producto, publicación o presentación utiliza un nombre, logotipo, etiqueta, envase, imagen o apariencia similar a FEROX, cuando no haya sido vendido directamente por FEROX o por un canal expresamente autorizado.",
    ],
  },
  {
    title: "14. Alimentación, tolerancias y consulta profesional",
    body: [
      "La información de la web, calculadoras, recomendaciones y contenidos comerciales es orientativa y no reemplaza la evaluación de un médico veterinario o profesional competente. Cada perro es distinto y puede tener necesidades particulares.",
      "Ante alergias, patologías, enfermedades, tratamientos, condiciones médicas, intolerancias, dudas alimentarias o cambios de dieta, el cliente debe consultar con un médico veterinario o profesional competente antes de usar el producto. FEROX no se hace responsable por efectos derivados de omitir esa consulta, por una transición alimentaria inadecuada o por condiciones particulares no informadas.",
    ],
  },
  {
    title: "15. Responsabilidad del cliente",
    body: [
      "El cliente es responsable de entregar información correcta, coordinar la recepción, conservar el producto adecuadamente, respetar la cadena de frío, introducir el alimento de forma gradual y observar la tolerancia individual de su perro.",
      "Si observa reacciones adversas, molestias persistentes, rechazo significativo o cualquier señal preocupante, debe suspender el uso según criterio responsable y consultar con un médico veterinario o profesional competente.",
    ],
  },
  {
    title: "16. Propiedad intelectual y uso de marca",
    body: [
      "La marca FEROX, su logo, textos, imágenes, diseño, etiquetas, fotografías, contenido visual, nombres comerciales y elementos gráficos pertenecen a FEROX o se utilizan con autorización. No pueden ser copiados, modificados, revendidos, utilizados para suplantar la marca o para confundir a clientes.",
      "El uso no autorizado de la identidad de FEROX, de sus imágenes o de una presentación similar puede afectar la confianza de los clientes y la correcta identificación de los canales oficiales.",
    ],
  },
  {
    title: "17. Limitación de responsabilidad",
    body: [
      "FEROX trabaja para entregar productos de calidad, información clara y una experiencia responsable. Sin perjuicio de ello, no será responsable por daños, pérdidas o inconvenientes derivados de información incorrecta entregada por el cliente, mala conservación posterior a la entrega, compra a terceros, uso inadecuado del producto, omisión de consulta profesional o circunstancias fuera de su control razonable.",
      "La responsabilidad de FEROX, cuando corresponda, se limitará al pedido directamente contratado y efectivamente confirmado por sus canales oficiales.",
    ],
  },
  {
    title: "18. Modificaciones de estos términos",
    body: [
      "FEROX puede actualizar estos Términos y Condiciones para reflejar cambios operativos, comerciales, legales o de servicio. La versión publicada en el sitio será la vigente desde su publicación.",
      "Se recomienda revisar esta página periódicamente, especialmente antes de realizar nuevos pedidos o contratar planes mensuales.",
    ],
  },
  {
    title: "19. Contacto",
    body: [
      "Para consultas sobre estos Términos y Condiciones, pedidos, conservación, canales oficiales o información de compra, puedes contactar a FEROX escribiendo a Ferox156500@gmail.com o mediante los canales oficiales publicados en el sitio.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="border-b border-border bg-foreground px-4 py-16 text-background sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-background/60">
            FEROX BARF
          </p>
          <h1 className="mt-4 font-sans text-4xl font-black tracking-tight sm:text-5xl">
            Términos y Condiciones
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-background/75 sm:text-base">
            Condiciones de uso, compra, despacho, conservación y consumo responsable de productos FEROX BARF.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-5">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-6">
              <h2 className="font-sans text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}

          <div className="rounded-2xl bg-foreground p-5 text-background sm:p-6">
            <p className="text-sm leading-relaxed text-background/75">
              Si necesitas confirmar canales oficiales, revisar un pedido o resolver dudas sobre conservación, contáctanos antes de comprar o consumir el producto.
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-full bg-background px-5 py-3 text-sm font-bold text-foreground transition hover:bg-background/90"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
