import React from 'react';

interface RealisticRavenBookendProps {
  flip?: boolean;
}

export const RealisticRavenBookend: React.FC<RealisticRavenBookendProps> = ({ flip = false }) => {
  const idPrefix = flip ? 'raven-r' : 'raven-l';

  return (
    <div
      className={`shrink-0 flex flex-col items-center justify-end select-none pointer-events-none pb-0 z-20 ${
        flip ? 'ml-1 sm:ml-2.5' : 'mr-1 sm:mr-2.5'
      }`}
    >
      <div
        className={`relative w-16 sm:w-20 md:w-22 h-48 sm:h-56 flex flex-col items-center justify-end transition-transform ${
          flip ? '-scale-x-100' : ''
        }`}
      >
        <svg
          viewBox="0 0 160 260"
          className="w-full h-auto drop-shadow-[0_16px_22px_rgba(0,0,0,0.95)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Feathers Iridescence & Shading */}
            <linearGradient id={`${idPrefix}-body`} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#2b343d" />
              <stop offset="25%" stopColor="#1b2229" />
              <stop offset="55%" stopColor="#12181f" />
              <stop offset="85%" stopColor="#0b0f13" />
              <stop offset="100%" stopColor="#050709" />
            </linearGradient>

            <linearGradient id={`${idPrefix}-wing-sheen`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3d4957" />
              <stop offset="30%" stopColor="#222b36" />
              <stop offset="70%" stopColor="#141a22" />
              <stop offset="100%" stopColor="#090c0f" />
            </linearGradient>

            <linearGradient id={`${idPrefix}-hackles`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#323c47" />
              <stop offset="50%" stopColor="#1d242c" />
              <stop offset="100%" stopColor="#0c1014" />
            </linearGradient>

            {/* Gnarled Branch Bark Gradients */}
            <linearGradient id={`${idPrefix}-bark-main`} x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#25160b" />
              <stop offset="25%" stopColor="#452a17" />
              <stop offset="55%" stopColor="#5c3920" />
              <stop offset="80%" stopColor="#382212" />
              <stop offset="100%" stopColor="#1b1007" />
            </linearGradient>

            <linearGradient id={`${idPrefix}-bark-top`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6e4628" />
              <stop offset="40%" stopColor="#4d301b" />
              <stop offset="100%" stopColor="#24150a" />
            </linearGradient>

            <linearGradient id={`${idPrefix}-wood-cut`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#52361f" />
              <stop offset="50%" stopColor="#3d2614" />
              <stop offset="100%" stopColor="#26160a" />
            </linearGradient>

            {/* Beak & Claws */}
            <linearGradient id={`${idPrefix}-beak`} x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#252c31" />
              <stop offset="40%" stopColor="#161b1e" />
              <stop offset="80%" stopColor="#0c0f11" />
              <stop offset="100%" stopColor="#050607" />
            </linearGradient>

            <linearGradient id={`${idPrefix}-claw`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#363f45" />
              <stop offset="60%" stopColor="#1a2024" />
              <stop offset="100%" stopColor="#090b0d" />
            </linearGradient>
          </defs>

          {/* ======================================================== */}
          {/* LAYER 1: GNARLED OAK BRANCH (BASE & PERCH)               */}
          {/* ======================================================== */}
          <g id="branch">
            {/* Cut Wood Bottom Trunk Base with Tree Rings */}
            <ellipse cx="28" cy="252" rx="16" ry="6" fill={`url(#${idPrefix}-wood-cut)`} stroke="#1b1007" strokeWidth="1" />
            <ellipse cx="28" cy="252" rx="10" ry="3.8" stroke="#331f11" strokeWidth="0.8" fill="none" opacity="0.7" />
            <ellipse cx="28" cy="252" rx="4.5" ry="1.6" stroke="#25160b" strokeWidth="0.8" fill="#1b1007" />

            {/* Main Twisted Bough ascending to perching branch */}
            <path
              d="M14 252 
                 C15 228 22 208 30 195 
                 C35 186 42 182 54 180 
                 C70 178 95 181 120 179 
                 C136 178 148 181 156 186 
                 C158 190 156 195 150 197 
                 C138 200 115 197 94 200 
                 C78 202 60 205 48 212 
                 C38 218 34 235 38 252 
                 Z"
              fill={`url(#${idPrefix}-bark-main)`}
              stroke="#170d06"
              strokeWidth="1.5"
            />

            {/* Upper Branch Highlight Contour */}
            <path
              d="M30 195 
                 C38 184 48 180 62 179 
                 C80 177 106 180 128 178 
                 C142 177 152 181 156 186 
                 C154 184 140 180 126 180 
                 C104 181 78 179 62 181 
                 C48 183 38 187 30 195 Z"
              fill={`url(#${idPrefix}-bark-top)`}
              opacity="0.85"
            />

            {/* Natural Gnarled Knot & Offshooting Twig */}
            <path
              d="M32 196 
                 C24 202 14 208 10 216 
                 C8 220 12 222 15 218 
                 C19 212 28 206 36 202 Z"
              fill="#2b190e"
              stroke="#190e06"
              strokeWidth="0.8"
            />
            {/* Knot on main bough */}
            <ellipse cx="42" cy="192" rx="4" ry="7" fill="#1b0f07" stroke="#3b2313" strokeWidth="1" transform="rotate(-20 42 192)" />
            <circle cx="42" cy="192" r="1.8" fill="#0d0703" />

            {/* Bark Fissure Lines for deep organic wood texture */}
            <path d="M22 245 C24 232 26 218 32 208" stroke="#170c05" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M27 248 C28 238 31 226 36 215" stroke="#170c05" strokeWidth="1" strokeLinecap="round" />
            <path d="M52 185 C68 184 88 186 106 185" stroke="#25150a" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M64 191 C84 190 108 191 130 189" stroke="#1a0d06" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M78 196 C96 195 116 195 136 193" stroke="#221208" strokeWidth="0.9" strokeLinecap="round" />

            {/* Subtle Ancient Lichen/Moss Highlights on Branch */}
            <path d="M60 179 C65 178 72 178 76 179" stroke="#485c34" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
            <path d="M102 179 C108 178 116 178 122 179" stroke="#4a5e35" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
          </g>

          {/* ======================================================== */}
          {/* LAYER 2: RAVEN FEATHERED LEGS & REAR TALONS              */}
          {/* ======================================================== */}
          <g id="legs-and-claws">
            {/* Feathery Leg Trousers (Tibiotarsus feathers) */}
            <path
              d="M62 165 C60 172 61 179 63 182 C65 184 69 183 71 180 C73 176 74 168 73 162 Z"
              fill="#10151a"
              stroke="#212a32"
              strokeWidth="0.8"
            />
            <path
              d="M82 166 C80 173 81 180 83 183 C85 185 89 184 91 181 C93 177 94 169 93 163 Z"
              fill="#10151a"
              stroke="#212a32"
              strokeWidth="0.8"
            />

            {/* Left Foot: Talons gripping tightly over the branch */}
            {/* Toe 1 (Outer front) */}
            <path
              d="M63 181 C60 184 59 189 61 193 C62 195 64 194 64 191 C64 187 65 183 67 181 Z"
              fill={`url(#${idPrefix}-claw)`}
              stroke="#07090b"
              strokeWidth="0.8"
            />
            {/* Toe 2 (Center front with curved sharp talon) */}
            <path
              d="M68 181 C68 186 68 193 70 197 C72 199 74 197 73 193 C72 188 72 183 72 181 Z"
              fill={`url(#${idPrefix}-claw)`}
              stroke="#07090b"
              strokeWidth="0.8"
            />
            {/* Toe 3 (Inner front) */}
            <path
              d="M72 181 C74 185 76 191 79 194 C81 195 82 193 80 190 C78 186 76 182 74 181 Z"
              fill={`url(#${idPrefix}-claw)`}
              stroke="#07090b"
              strokeWidth="0.8"
            />

            {/* Right Foot: Talons gripping over the branch */}
            {/* Toe 1 */}
            <path
              d="M83 182 C80 185 79 190 81 194 C82 196 84 195 84 192 C84 188 85 184 87 182 Z"
              fill={`url(#${idPrefix}-claw)`}
              stroke="#07090b"
              strokeWidth="0.8"
            />
            {/* Toe 2 (Center) */}
            <path
              d="M88 182 C88 187 88 194 90 198 C92 200 94 198 93 194 C92 189 92 184 92 182 Z"
              fill={`url(#${idPrefix}-claw)`}
              stroke="#07090b"
              strokeWidth="0.8"
            />
            {/* Toe 3 */}
            <path
              d="M92 182 C94 186 96 192 99 195 C101 196 102 194 100 191 C98 187 96 183 94 182 Z"
              fill={`url(#${idPrefix}-claw)`}
              stroke="#07090b"
              strokeWidth="0.8"
            />

            {/* Sharp Talon Tips curling into bark */}
            <path d="M61 193 L59 197 L62 195 Z" fill="#000000" />
            <path d="M70 197 L69 202 L72 199 Z" fill="#000000" />
            <path d="M79 194 L80 199 L82 196 Z" fill="#000000" />
            <path d="M81 194 L79 198 L82 196 Z" fill="#000000" />
            <path d="M90 198 L89 203 L92 200 Z" fill="#000000" />
            <path d="M99 195 L100 200 L102 197 Z" fill="#000000" />
          </g>

          {/* ======================================================== */}
          {/* LAYER 3: WEDGE-SHAPED RAVEN TAIL                         */}
          {/* ======================================================== */}
          <g id="tail">
            {/* Long Wedge-Shaped Rectrices extending down behind branch */}
            {/* Outer left tail feather */}
            <path
              d="M45 160 C38 180 32 205 28 226 C30 228 34 227 36 222 C42 204 48 180 52 165 Z"
              fill="#080b0e"
              stroke="#182028"
              strokeWidth="0.8"
            />
            {/* Mid tail feather */}
            <path
              d="M48 160 C42 185 36 215 32 238 C34 240 39 238 42 232 C48 210 54 182 56 164 Z"
              fill="#0d1116"
              stroke="#212a34"
              strokeWidth="0.8"
            />
            {/* Central longest tail feather (Creates the Raven's classic diamond/wedge shape) */}
            <path
              d="M52 160 C48 188 43 222 38 248 C41 251 47 248 50 240 C57 216 63 184 62 164 Z"
              fill="#131920"
              stroke="#2b3642"
              strokeWidth="0.9"
            />
            {/* Shaft line down central feather */}
            <path d="M52 164 C47 195 42 225 39 248" stroke="#374554" strokeWidth="0.7" opacity="0.6" />
          </g>

          {/* ======================================================== */}
          {/* LAYER 4: RAVEN TORSO, FLANK & UNDERBELLY                 */}
          {/* ======================================================== */}
          <g id="torso">
            <path
              d="M54 75 
                 C48 95 46 125 50 148 
                 C52 158 56 168 64 172 
                 C76 176 88 174 98 165 
                 C108 152 110 134 108 116 
                 C104 98 94 82 82 72 
                 C70 64 60 66 54 75 Z"
              fill={`url(#${idPrefix}-body)`}
              stroke="#1b232a"
              strokeWidth="1.2"
            />
          </g>

          {/* ======================================================== */}
          {/* LAYER 5: FOLDED WING (COVERTS & PRIMARY REMIGES)         */}
          {/* ======================================================== */}
          <g id="wing">
            {/* Main Folded Wing Shape */}
            <path
              d="M55 76 
                 C46 95 44 122 47 146 
                 C49 162 55 178 68 196 
                 C70 198 73 197 73 193 
                 C72 178 72 160 76 142 
                 C80 120 86 102 82 86 
                 C80 78 74 72 66 70 
                 C60 69 56 72 55 76 Z"
              fill={`url(#${idPrefix}-wing-sheen)`}
              stroke="#26313c"
              strokeWidth="1.2"
            />

            {/* Scapular Feather Layers (Upper Shoulder) */}
            <path d="M58 84 C54 94 54 106 58 115" stroke="#3e4d5c" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            <path d="M64 80 C60 92 60 108 65 120" stroke="#3e4d5c" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
            <path d="M70 78 C68 90 68 106 72 118" stroke="#3e4d5c" strokeWidth="1" strokeLinecap="round" opacity="0.7" />

            {/* Greater & Median Covert Scales */}
            <path d="M52 115 C50 128 52 142 58 154" stroke="#33404d" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            <path d="M58 118 C56 132 58 148 64 162" stroke="#33404d" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
            <path d="M64 120 C63 135 66 152 70 166" stroke="#33404d" strokeWidth="1" strokeLinecap="round" opacity="0.8" />

            {/* Long Primary Flight Feathers overlapping toward the tail */}
            {/* Primary 1 */}
            <path
              d="M52 145 C54 164 60 182 68 198 C69 200 71 199 71 196 C67 180 62 162 58 144 Z"
              fill="#080b0e"
              stroke="#28333e"
              strokeWidth="0.8"
            />
            {/* Primary 2 (Longest wing tip extending over the tail) */}
            <path
              d="M56 150 C58 170 65 192 74 212 C75 214 77 213 77 210 C72 190 66 168 62 148 Z"
              fill="#0d1115"
              stroke="#313f4d"
              strokeWidth="0.8"
            />
            {/* Primary 3 */}
            <path
              d="M60 152 C63 172 70 192 80 208 C81 210 83 208 82 205 C77 188 71 168 66 150 Z"
              fill="#12171e"
              stroke="#3a4a5a"
              strokeWidth="0.8"
            />
            {/* Wing Tip Specular Light Accent */}
            <path d="M60 156 C64 176 72 196 76 210" stroke="#485b6e" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
          </g>

          {/* ======================================================== */}
          {/* LAYER 6: SHAGGY THROAT & BREAST HACKLES                  */}
          {/* (Signature Anatomical Feature of the Raven)              */}
          {/* ======================================================== */}
          <g id="hackles">
            {/* Elongated lanceolate feathers that puff from throat */}
            <path
              d="M86 64 
                 C88 74 94 84 98 90 C96 85 96 80 94 72 
                 C98 80 103 92 105 100 C103 94 102 88 100 80 
                 C104 90 108 104 110 114 C107 106 106 98 104 90 
                 C108 100 112 116 112 126 C109 116 108 108 106 98 
                 C108 110 109 125 106 136 C104 125 102 115 100 105 
                 C98 116 95 128 90 138 C92 126 92 116 90 106 
                 Z"
              fill={`url(#${idPrefix}-hackles)`}
              stroke="#2b3642"
              strokeWidth="0.9"
            />

            {/* Individual Hackle Spine Highlights */}
            <path d="M90 74 C95 84 99 92 102 98" stroke="#48596b" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
            <path d="M96 84 C102 96 106 106 108 114" stroke="#48596b" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
            <path d="M100 96 C105 108 108 118 108 126" stroke="#48596b" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
            <path d="M98 106 C100 116 99 126 96 134" stroke="#48596b" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
          </g>

          {/* ======================================================== */}
          {/* LAYER 7: HEAD, NAPE & BEAK                               */}
          {/* ======================================================== */}
          <g id="head-and-bill">
            {/* Head & Nape Dome */}
            <path
              d="M82 40 
                 C74 38 66 45 66 54 
                 C66 62 70 70 78 74 
                 C86 78 94 76 100 70 
                 C106 64 105 52 100 45 
                 C95 40 88 39 82 40 Z"
              fill="#182027"
              stroke="#2c3742"
              strokeWidth="1.1"
            />

            {/* Crown Feathers Ruffling */}
            <path d="M78 39 C75 35 72 36 70 40" stroke="#3e4c5a" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M83 38 C81 33 78 33 76 37" stroke="#3e4c5a" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M89 39 C88 34 85 34 84 38" stroke="#3e4c5a" strokeWidth="1.1" strokeLinecap="round" />

            {/* Powerful Raven Beak (Heavy, with curved culmen) */}
            {/* Upper Mandible */}
            <path
              d="M98 48 
                 C108 47 122 51 138 60 
                 C130 65 118 68 104 66 
                 C100 65 98 62 98 48 Z"
              fill={`url(#${idPrefix}-beak)`}
              stroke="#0a0d0f"
              strokeWidth="1.2"
            />
            {/* Decurved Sharp Beak Tip */}
            <path d="M132 57 C138 60 144 65 142 67 C138 68 132 66 128 64 Z" fill="#050608" />

            {/* Beak Mouth Gape Line (Tomium) */}
            <path d="M102 63 C114 63 126 62 139 63" stroke="#3c4750" strokeWidth="1" strokeLinecap="round" />

            {/* Lower Mandible (Gonydeal angle) */}
            <path
              d="M102 63 
                 C114 63 126 62 139 63 
                 C134 67 125 70 114 70 
                 C106 70 102 67 102 63 Z"
              fill="#111619"
              stroke="#07090a"
              strokeWidth="0.9"
            />

            {/* Dense Nasal Bristles covering base of upper bill */}
            {/* (Key raven trait: stiff forward-pointing hair-like feathers) */}
            <path d="M98 47 C104 48 110 50 114 54 C109 52 103 51 98 51 Z" fill="#1b232a" />
            <path d="M99 48 C105 49 112 52 116 55" stroke="#384552" strokeWidth="0.9" strokeLinecap="round" />
            <path d="M100 46 C106 48 111 51 115 53" stroke="#384552" strokeWidth="0.9" strokeLinecap="round" />
            <path d="M98 51 C104 53 109 55 113 57" stroke="#384552" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M97 53 C102 55 107 57 111 59" stroke="#384552" strokeWidth="0.8" strokeLinecap="round" />

            {/* ======================================================== */}
            {/* LAYER 8: KEEN GLINTING RAVEN EYE                         */}
            {/* ======================================================== */}
            {/* Orbital Ring (Fine dark feathered ring around eye) */}
            <ellipse cx="91" cy="51" rx="5" ry="4.5" fill="#0d1114" stroke="#252f38" strokeWidth="0.8" />

            {/* Dark Charcoal-Brown Iris */}
            <circle cx="91" cy="51" r="3.2" fill="#2d1c10" />

            {/* Deep Obsidian Pupil */}
            <circle cx="91.2" cy="51" r="2.1" fill="#000000" />

            {/* Intense Specular Eye Reflection (Gleaming intelligent eye) */}
            <circle cx="90.3" cy="49.8" r="1.1" fill="#ffffff" />
            <circle cx="92.2" cy="51.8" r="0.5" fill="#f8fafc" opacity="0.8" />
          </g>
        </svg>
      </div>
    </div>
  );
};
