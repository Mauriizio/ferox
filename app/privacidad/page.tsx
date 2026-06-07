import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | FEROX BARF",
  description:
    "Política de Privacidad de FEROX BARF sobre datos de cuenta, pedidos, mascotas, comentarios y uso del sitio.",
  alternates: {
    canonical: "https://feroxbarf.com/privacidad",
  },
};

const sections = [
  {
    title: "1. Introducción",
    body: [
      "Esta Política de Privacidad explica cómo FEROX BARF recopila, utiliza, conserva y protege los datos personales entregados por usuarios, clientes y visitantes al usar el sitio web, crear una cuenta, registrar mascotas, publicar comentarios, solicitar productos, contratar planes o comunicarse por canales oficiales.",
      "El objetivo es operar el servicio de manera responsable, coordinar pedidos y entregas, responder consultas y entregar una experiencia segura y transparente.",
    ],
  },
  {
    title: "2. Qué datos se recopilan",
    body: [
      "FEROX puede recopilar nombre, correo electrónico, teléfono, dirección, comuna o datos necesarios para entrega, información de pedidos, información de perfil, avatar o foto de perfil si el usuario la sube, información de perros registrada por el usuario, fotos de perros si el usuario las sube, comentarios o reseñas, datos técnicos básicos de navegación e información necesaria para autenticación y funcionamiento del sitio.",
      "La información puede ser entregada directamente por el usuario, generarse durante el uso del sitio o recibirse mediante canales de contacto oficiales, como WhatsApp, correo electrónico o redes sociales oficiales.",
    ],
  },
  {
    title: "3. Para qué se usan los datos",
    body: [
      "Los datos se usan para crear y gestionar cuentas, autenticar usuarios, gestionar perfiles, coordinar pedidos, coordinar entregas, responder consultas, entregar atención al cliente, administrar comentarios o reseñas, mejorar el servicio, operar la web, prevenir abuso o mal uso y cumplir obligaciones operativas o legales.",
      "FEROX procura utilizar solo la información necesaria para la finalidad correspondiente y mantener una comunicación clara con el usuario o cliente.",
    ],
  },
  {
    title: "4. Datos de cuenta y autenticación",
    body: [
      "Cuando una persona crea o utiliza una cuenta, pueden tratarse datos como correo electrónico, nombre, información de perfil, estado de sesión y datos técnicos necesarios para autenticar al usuario y permitir el acceso seguro a funciones del sitio.",
      "El usuario es responsable de mantener protegidas sus credenciales de acceso y de informar cualquier uso no autorizado o situación sospechosa relacionada con su cuenta.",
    ],
  },
  {
    title: "5. Datos de mascotas",
    body: [
      "El sitio puede permitir registrar información de perros, como nombre, edad, peso, características, estado general, fotos u otros datos ingresados voluntariamente por el usuario. Esta información se usa para organizar el perfil del usuario, mejorar la experiencia y apoyar herramientas o contenidos relacionados con alimentación.",
      "La información de mascotas no reemplaza una evaluación veterinaria. El usuario debe ingresar datos correctos y consultar con un profesional competente ante dudas de salud, dieta o condiciones particulares.",
    ],
  },
  {
    title: "6. Comentarios y reseñas",
    body: [
      "Si el usuario publica comentarios o reseñas, FEROX puede tratar el contenido publicado, nombre visible, datos asociados a la cuenta y registros necesarios para administrar la publicación, moderar uso indebido o responder consultas.",
      "El usuario debe evitar publicar datos sensibles, información de terceros sin autorización o contenido que pueda afectar derechos de otras personas.",
    ],
  },
  {
    title: "7. Pedidos y coordinación de entregas",
    body: [
      "Para gestionar pedidos y entregas, FEROX puede usar datos de contacto, dirección, comuna, referencias de entrega, información de productos solicitados, planes, comprobantes, conversaciones de coordinación y antecedentes necesarios para completar la compra.",
      "Estos datos permiten confirmar disponibilidad, coordinar horarios, resolver incidencias y entregar atención posterior a la compra cuando corresponda.",
    ],
  },
  {
    title: "8. Uso de proveedores tecnológicos",
    body: [
      "FEROX puede utilizar proveedores tecnológicos necesarios para operar la web, hosting, autenticación, almacenamiento, análisis técnico, comunicación o gestión de pedidos. Estos proveedores deben usarse para fines operativos del servicio y no para publicidad externa ajena a FEROX.",
      "El uso de estos servicios permite mantener el sitio disponible, guardar información de forma organizada, autenticar usuarios, procesar archivos subidos voluntariamente y facilitar la comunicación con clientes.",
    ],
  },
  {
    title: "9. Conservación de datos",
    body: [
      "Los datos se conservan durante el tiempo necesario para cumplir las finalidades descritas, mantener la cuenta o relación comercial, coordinar pedidos, responder consultas, administrar registros operativos, prevenir abuso y cumplir necesidades legales, contables, de seguridad o soporte.",
      "Cuando la información deja de ser necesaria, FEROX podrá eliminarla, anonimizarla o conservarla solo en la medida requerida para fines legítimos u obligaciones aplicables.",
    ],
  },
  {
    title: "10. Seguridad",
    body: [
      "FEROX adopta medidas razonables para proteger la información frente a accesos no autorizados, pérdida, uso indebido o alteración. Sin embargo, ningún sistema digital puede garantizar seguridad absoluta.",
      "El usuario también debe colaborar con la seguridad usando contraseñas adecuadas, evitando compartir accesos y comunicando cualquier situación sospechosa relacionada con su cuenta o información.",
    ],
  },
  {
    title: "11. No venta de datos personales",
    body: [
      "FEROX no vende datos personales. Los datos no se entregan a terceros para publicidad externa. La información puede compartirse únicamente cuando sea necesario para operar el servicio, coordinar entregas, usar proveedores tecnológicos, cumplir obligaciones aplicables o responder solicitudes legítimas.",
      "Cualquier uso operativo de proveedores debe estar relacionado con la prestación del servicio y la gestión responsable de la relación con usuarios y clientes.",
    ],
  },
  {
    title: "12. Derechos del usuario",
    body: [
      "El usuario puede solicitar revisión, corrección o eliminación de sus datos escribiendo a Ferox156500@gmail.com. FEROX evaluará la solicitud y responderá según corresponda, considerando necesidades operativas, legales, de seguridad, soporte o prevención de abuso.",
      "Para proteger la privacidad, FEROX puede solicitar antecedentes que permitan verificar la identidad o titularidad de la cuenta antes de modificar o eliminar información.",
    ],
  },
  {
    title: "13. Menores de edad",
    body: [
      "El sitio y los servicios comerciales de FEROX están dirigidos a personas mayores de edad o a quienes cuenten con autorización de su representante legal. No se busca recopilar intencionalmente datos de menores de edad.",
      "Si un adulto responsable detecta que un menor entregó información sin autorización, puede solicitar revisión o eliminación escribiendo a Ferox156500@gmail.com.",
    ],
  },
  {
    title: "14. Cambios en esta política",
    body: [
      "FEROX puede actualizar esta Política de Privacidad para reflejar cambios del sitio, servicios, proveedores, prácticas operativas o necesidades legales. La versión vigente será la publicada en esta página.",
      "Se recomienda revisar esta política periódicamente para mantenerse informado sobre el tratamiento de datos personales.",
    ],
  },
  {
    title: "15. Contacto",
    body: [
      "Para consultas de privacidad, revisión, corrección o eliminación de datos, puedes escribir a Ferox156500@gmail.com. También puedes usar los canales oficiales de FEROX publicados en el sitio para consultas generales de atención al cliente.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative border-b border-border bg-foreground px-4 py-16 text-background sm:px-6 lg:px-8">
        <Link href="/" className="interactive-lift premium-transition absolute left-4 top-4 inline-flex items-center" aria-label="Inicio FEROX">
          <Image src="/logoblanco.png" alt="FEROX" width={150} height={42} className="h-9 w-auto" priority />
        </Link>
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-background/60">
            FEROX BARF
          </p>
          <h1 className="mt-4 font-sans text-4xl font-black tracking-tight sm:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-background/75 sm:text-base">
            Información sobre recopilación, uso, conservación y protección de datos personales en FEROX BARF.
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
              Para ejercer tus derechos o resolver dudas sobre privacidad, escríbenos a Ferox156500@gmail.com.
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
