import { MessageCircle } from "lucide-react"

export function WhatsappFloat() {
  return (
    <a
      href="https://wa.me/56912345678?text=Hola,%20quiero%20info%20de%20FEROX%20BARF"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-3 sm:px-5 sm:py-3.5 text-sm font-medium text-background shadow-lg shadow-foreground/20 hover:bg-foreground/90 transition-all hover:scale-105"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}
