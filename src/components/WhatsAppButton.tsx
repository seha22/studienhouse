const phoneNumber = "628999053136";
const defaultMessage = encodeURIComponent("Halo, saya ingin bertanya tentang kelas di StudienHouse.");

const whatsappHref = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-pill transition hover:-translate-y-0.5 hover:shadow-display"
      aria-label="Hubungi via WhatsApp"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.01 2C6.49 2 2 6.29 2 11.51c0 1.88.59 3.63 1.6 5.08L2 22l5.64-1.85A9.98 9.98 0 0 0 12.01 21c5.5 0 9.99-4.29 9.99-9.51C22 6.29 17.5 2 12.01 2Zm0 17.11c-1.43 0-2.77-.35-3.94-.97l-.28-.14-3.34 1.1 1.09-3.19-.18-.3A7.8 7.8 0 0 1 4.2 11.5c0-4.1 3.49-7.43 7.8-7.43 4.3 0 7.8 3.33 7.8 7.43 0 4.09-3.5 7.42-7.8 7.42Z"
          fill="currentColor"
        />
        <path
          d="M17.44 14.55c-.29-.14-1.7-.84-1.96-.93-.26-.1-.45-.14-.63.14-.19.29-.73.93-.9 1.12-.17.2-.34.2-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.72-1.61-2-.17-.29-.02-.44.13-.58.13-.13.28-.34.42-.5.14-.17.18-.29.28-.48.1-.2.05-.36-.02-.5-.07-.14-.63-1.52-.86-2.08-.23-.55-.45-.47-.63-.48-.16-.01-.36-.01-.55-.01-.2 0-.52.07-.79.36-.27.3-1.04 1-1.04 2.42 0 1.42 1.07 2.79 1.22 2.98.15.2 2.1 3.39 5.1 4.6.71.3 1.27.48 1.7.62.71.23 1.36.2 1.87.12.57-.09 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.36-.07-.12-.26-.2-.55-.34Z"
          fill="currentColor"
        />
      </svg>
      <span>Whatsapp</span>
    </a>
  );
}
