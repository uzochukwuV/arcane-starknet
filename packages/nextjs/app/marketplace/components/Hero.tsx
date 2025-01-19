
import heroBackground from '../../../public/logo.svg';
import hero from "../../../images/hero/hero-image.svg"
import Link from 'next/link';


export default function Hero() {
    return <>

        <section id="home" className="f z gd xe ye ze jg kg"  style={{ 
        backgroundImage: `url(${heroBackground})` 
      }}>
      <div className="e h g _ ib pb" style={{
          background: 'linear-gradient(180deg, rgba(20, 20, 32, 0.65) 0%, #141420 100%)'
        }}></div>
      <div className="a">
        <div className="ea za xc yc">
          <div className="pb nf _k/2">
            <div className="ra gc tk">
              <h1 className="ia lh ph qh text-black lk tl om 2xl:ud-text-[50px] sm:text-[46px]">
                Arcane NFT Marketplace and Web3 Starknet Lottery
              </h1>
              <p className="qa hh oh rh uh kk">
              Template for NFT, Token, and Web3 marketplace projects, based on Tailwind CSS. Comes with all the essential UI components and pages you need to build an NFT marketplace or all sorts of Web3 platforms.
            </p>
              <div className="flex flex-wrap items-center">
                <Link href={"/marketplace"} className="pa ka _a yc _c ld pd yd he sf vf eh nh text-black ii aj">
                  Explore now
                </Link>
                <Link href={"/createnft"} className="ka _a yc _c ld pd vd sf vf eh nh text-black ii wi yi">
                  Upload Your Art
                </Link>
              </div>
            </div>
          </div>

          <div className="pb nf _k/2">
            <div className="ch">
              <img src={hero} alt="hero image" className="da bc" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <span className="e s t _">
          <svg width="111" height="115" viewBox="0 0 111 115" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_f_21_53)">
              <g filter="url(#filter1_i_21_53)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M73.287 91.7144C92.1417 80.8286 98.5953 56.729 87.7122 37.8789C76.8291 19.0288 52.7314 12.568 33.8767 23.4537C15.0312 34.3342 8.56843 58.4391 19.4515 77.2892C30.3346 96.1393 54.4415 102.595 73.287 91.7144Z" fill="url(#paint0_linear_21_53)"></path>
              </g>
              <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M69.4961 86.3067C86.2379 76.6408 91.9683 55.2418 82.3048 38.5041C72.6412 21.7663 51.244 16.0295 34.5021 25.6954C17.7685 35.3566 12.0299 56.7603 21.6934 73.498C31.357 90.2358 52.7625 95.9679 69.4961 86.3067Z" fill="url(#paint1_radial_21_53)"></path>
            </g>
            <defs>
              <filter id="filter0_f_21_53" x="-3.83423" y="0.165771" width="114.834" height="114.834" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                <feGaussianBlur stdDeviation="9" result="effect1_foregroundBlur_21_53"></feGaussianBlur>
              </filter>
              <filter id="filter1_i_21_53" x="14.1658" y="10.1658" width="86.8342" height="86.8342" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"></feBlend>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
                <feOffset dx="8" dy="-8"></feOffset>
                <feGaussianBlur stdDeviation="10"></feGaussianBlur>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
                <feColorMatrix type="matrix" values="0 0 0 0 0.168627 0 0 0 0 0.168627 0 0 0 0 0.321569 0 0 0 0.25 0"></feColorMatrix>
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_21_53"></feBlend>
              </filter>
              <linearGradient id="paint0_linear_21_53" x1="31.6878" y1="19.1263" x2="63.3007" y2="99.1224" gradientUnits="userSpaceOnUse">
                <stop stop-color="#EBC77A"></stop>
                <stop offset="0.541667" stop-color="#CA3F8D"></stop>
                <stop offset="1" stop-color="#5142FC"></stop>
              </linearGradient>
              <radialGradient id="paint1_radial_21_53" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(56.6039 36.9093) rotate(63.4349) scale(29.0091)">
                <stop stop-color="white"></stop>
                <stop offset="1" stop-color="white" stop-opacity="0"></stop>
              </radialGradient>
            </defs>
          </svg>
        </span>
        <div className="e h g _ za ib pb bd ai">
          <span className="ib wb ue ve we ab wk">
          </span>
          <span className="ib wb ue ve we ab wk">
          </span>
          <span className="ib wb ue ve we ab wk">
          </span>
          <span className="ib wb ue ve we ab gk">
          </span>
          <span className="ib wb ue ve we ab gk">
          </span>
          <span className="ib wb ue ve we ab gk">
          </span>
          <span className="ib wb ue ve we">
          </span>
          <span className="ib wb ue ve we">
          </span>
          <span className="ib wb ue ve we">
          </span>
          <span className="ib wb ue ve we">
          </span>
          <span className="ib wb ue ve we">
          </span>
          <span className="ib wb ue ve we">
          </span>
        </div>
      </div>
    </section>
    
    </>
}
