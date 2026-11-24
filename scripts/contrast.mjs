// WCAG 2.2 contrast checker for the real token pairs used in the UI.
const lum = (h) => { const c = [1,3,5].map(i => parseInt(h.slice(i,i+2),16)/255).map(v => v<=0.03928 ? v/12.92 : ((v+0.055)/1.055)**2.4); return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2] }
const ratio = (a,b) => { const [x,y] = [lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05) }
const T = {
  light: { bg:'#F8FAFC', surface:'#FFFFFF', subtle:'#F1F5F9', fg:'#0F172A', fg2:'#475569', muted:'#556275', border:'#64748B', primary:'#0B7A5B', onPrimary:'#FFFFFF', link:'#0B7A5B', selected:'#ECFDF5', mint:'#D1FAE5', warn:'#FEF3C7', warnFg:'#78350F', danger:'#B91C1C', dangerBg:'#FEE2E2', t1:'#DCFCE7', t2:'#F1EEFE', t3:'#E0F2FE', t4:'#FEF3C7', deep:'#065F46' },
  dark:  { bg:'#0B1220', surface:'#111C2E', subtle:'#1E293B', fg:'#F8FAFC', fg2:'#CBD5E1', muted:'#94A3B8', border:'#7C8BA1', primary:'#0B7A5B', onPrimary:'#FFFFFF', link:'#34D399', selected:'#123B32', mint:'#123B32', warn:'#422006', warnFg:'#FDE68A', danger:'#FCA5A5', dangerBg:'#450A0A', t1:'#123B32', t2:'#2A2650', t3:'#123349', t4:'#3A2E12', deep:'#065F46' },
}
let fail = 0
for (const [name,t] of Object.entries(T)) {
  const pairs = [
    ['text on bg', t.fg, t.bg, 4.5], ['text on surface', t.fg, t.surface, 4.5], ['secondary on surface', t.fg2, t.surface, 4.5],
    ['secondary on subtle', t.fg2, t.subtle, 4.5], ['muted on bg', t.muted, t.bg, 4.5], ['muted on surface', t.muted, t.surface, 4.5],
    ['muted on subtle', t.muted, t.subtle, 4.5], ['button text on primary', t.onPrimary, t.primary, 4.5], ['link on surface', t.link, t.surface, 4.5],
    ['link on selected', t.link, t.selected, 4.5], ['link on mint', t.link, t.mint, 4.5], ['text on selected', t.fg, t.selected, 4.5],
    ['warn text on warn', t.warnFg, t.warn, 4.5], ['danger on surface', t.danger, t.surface, 4.5], ['danger on dangerBg', t.danger, t.dangerBg, 4.5],
    ...['t1','t2','t3','t4'].flatMap((k) => [[`text on tint ${k}`, t.fg, t[k], 4.5], [`secondary on tint ${k}`, t.fg2, t[k], 4.5], [`link on tint ${k}`, t.link, t[k], 4.5]]),
    ['white on deep CTA', '#FFFFFF', t.deep, 4.5], ['white 90% on deep CTA', '#E6EFEC', t.deep, 4.5],
    ['control border on surface (3:1)', t.border, t.surface, 3], ['primary button vs page bg (3:1)', t.primary, t.bg, 3],
  ]
  for (const [label,a,b,min] of pairs) { const r = ratio(a,b); const ok = r>=min; if(!ok) fail++; console.log(`${name.padEnd(5)} ${ok?'PASS':'FAIL'} ${r.toFixed(2).padStart(5)}  (need ${min})  ${label}`) }
}
console.log('\n#22C55E on white (decorative only, never text):', ratio('#22C55E','#FFFFFF').toFixed(2))
process.exit(fail?1:0)