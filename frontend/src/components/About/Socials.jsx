import './Socials.css'

export default function Socials() {
  return (
    <div className='Socials'>
        <a
    href="https://m.facebook.com/ieeedtu/"
    target="_blank"
    rel="noopener noreferrer"
    className="relative inline-flex items-center justify-center group"
  >
    <svg
      viewBox="0 0 100 100"
      className="w-14 h-14 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
      aria-hidden="true"
    >
      <polygon
        fill="#2563eb"
        className="transition-colors duration-300 group-hover:fill-indigo-400"
        points="
          50,0 57,18 74,6 70,26 90,20 80,38
          100,50 80,62 90,80 70,74 74,94 57,82
          50,100 43,82 26,94 30,74 10,80 20,62
          0,50 20,38 10,20 30,26 26,6 43,18
        "
      />
    </svg>
    <i className="fa-brands fa-facebook absolute text-white text-2xl" />
  </a>

  {/* INSTAGRAM */}
  <a
    href="https://www.instagram.com/vihaan_dtu/"
    target="_blank"
    rel="noopener noreferrer"
    className="relative group"
  >
    <svg
      width="64"
      height="64"
      viewBox="0 0 60 70"
      className="absolute transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
    >
      <polygon
        points="32,64 60,34 48,15 14,16 6,32"
        fill="#e6b800"
        stroke="#b22222"
        strokeWidth="4"
        className="transition-colors duration-300 group-hover:fill-yellow-300"
      />
    </svg>
    <i className="fa-brands fa-instagram relative text-white text-3xl m-4" />
  </a>

  {/* LINKEDIN */}
  <a
    href="https://www.linkedin.com/company/ieee-dtu/posts/?feedView=all"
    target="_blank"
    rel="noopener noreferrer"
    className="relative inline-flex items-center justify-center group"
  >
    <svg
      viewBox="0 0 100 100"
      className="w-14 h-14 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg"
      aria-hidden="true"
    >
      <polygon
        fill="#b91c1c"
        className="transition-colors duration-300 group-hover:fill-blue-500"
        points="
          50,0 57,18 74,6 70,26 90,20 80,38
          100,50 80,62 90,80 70,74 74,94 57,82
          50,100 43,82 26,94 30,74 10,80 20,62
          0,50 20,38 10,20 30,26 26,6 43,18
        "
      />
    </svg>
    <i className="fa-brands fa-linkedin-in absolute text-white text-2xl" />
  </a>
    </div>
  )
}
