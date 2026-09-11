import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "919916390580";
const WHATSAPP_MESSAGE = "Hey Akash, I'd like to connect!";

const WhatsAppButton = () => {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        group fixed bottom-6 right-6 z-70
        flex lg:h-14 h-10 lg:w-14 w-10 items-center justify-center
        rounded-full bg-black text-white
        shadow-[0_4px_20px_rgba(0,0,0,0.35)]
        transition-transform duration-300 ease-out
        hover:scale-110 hover:bg-blue
        active:scale-95
      "
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-blue/40 animate-ping group-hover:opacity-0" />
      <FaWhatsapp size={window.innerWidth > 991 ? 26 : 20} className="relative z-10 text-green-500" />
    </a>
  );
};

export default WhatsAppButton;
