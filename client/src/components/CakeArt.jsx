// Illustration vectorielle du gâteau aux framboises (remplaçable par une vraie photo dans la section "hero")
const berries = [[118,92],[150,78],[185,70],[222,66],[258,70],[292,78],[324,92],[170,96],[205,88],[240,86],[275,92],[135,104],[310,106]];
export default function CakeArt({ className = '' }) {
  return (
    <svg viewBox="0 0 440 330" className={className} role="img" aria-label="Gâteau aux framboises">
      <defs>
        <radialGradient id="plate" cx="50%" cy="40%"><stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#f3dcd8"/></radialGradient>
        <linearGradient id="sponge" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#f6d79a"/><stop offset="1" stopColor="#e7b66b"/></linearGradient>
        <linearGradient id="glaze" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#e8334f"/><stop offset="1" stopColor="#b8142f"/></linearGradient>
        <radialGradient id="berry" cx="35%" cy="30%"><stop offset="0" stopColor="#ff6b81"/><stop offset="1" stopColor="#b3122e"/></radialGradient>
      </defs>
      <ellipse cx="220" cy="272" rx="205" ry="48" fill="url(#plate)" stroke="#ecd0cb" strokeWidth="3"/>
      <ellipse cx="220" cy="268" rx="165" ry="34" fill="#fff" stroke="#f0d9d5" strokeWidth="2"/>
      <ellipse cx="220" cy="278" rx="150" ry="30" fill="#000" opacity=".06"/>
      {/* corps */}
      <path d="M70 112 V235 Q70 262 220 262 Q370 262 370 235 V112 Z" fill="#fffaf5"/>
      {/* part découpée */}
      <path d="M220 130 L330 112 V236 Q300 250 220 252 Z" fill="url(#sponge)"/>
      <path d="M220 168 L330 154 V176 L220 190 Z" fill="#f6c3cc"/>
      <path d="M220 206 L330 196 V216 L220 226 Z" fill="#f6c3cc"/>
      <g fill="#b8142f">{[[245,184],[270,176],[296,170],[255,214],[285,208]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="8"/>)}</g>
      <path d="M220 130 L330 112" stroke="#d9a65a" strokeWidth="3"/>
      {/* glaçage */}
      <path d="M62 112 Q62 84 220 84 Q378 84 378 112 Q378 132 360 132 L358 172 Q352 186 346 172 L344 136 Q330 140 318 134 L316 158 Q308 170 302 158 L300 134 Q260 142 220 134 Q150 144 110 134 L108 188 Q100 204 92 188 L90 134 Q62 134 62 112 Z" fill="url(#glaze)"/>
      <ellipse cx="220" cy="100" rx="150" ry="16" fill="#ff7a90" opacity=".35"/>
      {berries.map(([x,y],i)=>(
        <g key={i}><circle cx={x+40} cy={y-10} r={i%3===0?15:13} fill="url(#berry)"/><circle cx={x+36} cy={y-15} r="3.5" fill="#fff" opacity=".55"/></g>
      ))}
      {[[196,62],[330,72]].map(([x,y],i)=><path key={i} d={`M${x} ${y} q12 -22 26 -4 q-8 16 -26 4z`} fill="#4f9a55"/>)}
      <ellipse cx="205" cy="268" rx="38" ry="8" fill="#d4183a" opacity=".85"/>
    </svg>
  );
}
