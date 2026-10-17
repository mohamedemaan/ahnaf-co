import React from "react";

export default function AdminWorkspaceIllustration() {
  return (
    <div className="w-full flex flex-col items-center justify-center relative select-none">
      <svg
        viewBox="0 0 500 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[420px] h-auto drop-shadow-sm"
      >
        {/* Soft Ambient Background Cloud */}
        <path
          d="M70 210C70 170 100 140 145 140C155 110 185 90 225 90C270 90 305 118 315 150C345 150 370 172 370 205C370 240 340 265 305 265H135C95 265 70 240 70 210Z"
          fill="#EEF2F6"
          opacity="0.9"
        />

        {/* Ground Baseline */}
        <rect x="25" y="325" width="450" height="7" rx="3.5" fill="#1E293B" />
        <circle cx="18" cy="328.5" r="3.5" fill="#3B82F6" />
        <circle cx="482" cy="328.5" r="3.5" fill="#3B82F6" />

        {/* Desk Lamp */}
        <path d="M335 325V210" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <path d="M335 210L315 175" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        <path d="M305 175H325L330 190H300L305 175Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="2" />
        <circle cx="335" cy="323" r="10" fill="#64748B" />
        <path d="M295 195L270 260" stroke="#FEF08A" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />

        {/* Potted Desk Plant */}
        <path d="M380 325H405L400 290H385L380 325Z" fill="#334155" />
        <path d="M392 290C392 270 375 255 365 265C365 280 385 288 392 290Z" fill="#10B981" />
        <path d="M392 290C392 265 410 250 420 260C420 278 400 288 392 290Z" fill="#059669" />
        <path d="M392 290V250C392 245 385 242 380 248C380 265 390 280 392 290Z" fill="#34D399" />

        {/* Floating Notification / Chat Bubble */}
        <g className="animate-bounce" style={{ animationDuration: "3.5s" }}>
          <rect x="245" y="115" width="48" height="34" rx="8" fill="#F43F5E" />
          <path d="M255 149L250 157V149H255Z" fill="#F43F5E" />
          <circle cx="258" cy="132" r="3" fill="#FFFFFF" />
          <circle cx="269" cy="132" r="3" fill="#FFFFFF" />
          <circle cx="280" cy="132" r="3" fill="#FFFFFF" />
        </g>

        {/* Executive Office Chair */}
        <path d="M180 235H225C230 235 235 240 235 245V295H170V245C170 240 175 235 180 235Z" fill="#F43F5E" />
        <path d="M175 200C175 185 188 175 202 175C216 175 230 185 230 200V235H175V200Z" fill="#E11D48" />
        <rect x="198" y="295" width="8" height="25" fill="#334155" />
        <path d="M185 320L202 295L220 320" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

        {/* Administrator Character */}
        <circle cx="202" cy="158" r="18" fill="#FBCFE8" />
        <path d="M184 152C184 140 192 132 204 132C216 132 222 140 222 148C222 152 220 155 218 156C218 152 214 145 204 145C195 145 190 150 188 156C185 155 184 154 184 152Z" fill="#1E293B" />
        <circle cx="198" cy="157" r="2" fill="#0F172A" />
        <circle cx="208" cy="157" r="2" fill="#0F172A" />
        <path d="M200 165C202 167 205 167 207 165" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" />

        {/* Navy Business Suit */}
        <path d="M180 185C180 175 190 172 202 172C214 172 225 175 225 185V245H180V185Z" fill="#1E293B" />
        <path d="M198 172L202 195L207 172Z" fill="#FFFFFF" />
        <path d="M201 176L203 198L205 176Z" fill="#EF4444" />

        {/* Trousers & Shoes */}
        <rect x="185" y="245" width="14" height="60" rx="3" fill="#0F172A" />
        <rect x="205" y="245" width="14" height="60" rx="3" fill="#0F172A" />
        <rect x="180" y="300" width="22" height="10" rx="4" fill="#F43F5E" />
        <rect x="208" y="300" width="22" height="10" rx="4" fill="#F43F5E" />

        {/* Wooden Top Desk */}
        <rect x="65" y="235" width="230" height="10" rx="3" fill="#92400E" />
        <path d="M75 245V325" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />
        <path d="M285 245V325" stroke="#1E293B" strokeWidth="5" strokeLinecap="round" />

        {/* Laptop on Workstation */}
        <path d="M130 235H180L175 228H135L130 235Z" fill="#94A3B8" />
        <path d="M135 228L150 185H185L175 228H135Z" fill="#0F172A" />
        <rect x="142" y="190" width="36" height="32" rx="1" fill="#3B82F6" opacity="0.9" />
        <path d="M150 205L158 200L168 212" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

        {/* Desk Books & Mug */}
        <rect x="80" y="222" width="30" height="5" rx="1" fill="#3B82F6" />
        <rect x="82" y="217" width="26" height="5" rx="1" fill="#10B981" />
        <rect x="81" y="227" width="32" height="8" rx="1.5" fill="#F43F5E" />
        <rect x="215" y="225" width="10" height="10" rx="2" fill="#E2E8F0" />
        <path d="M225 227C227 227 228 228 228 230C228 232 227 233 225 233" stroke="#CBD5E1" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

