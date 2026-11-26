// WCAG 2.2 contrast checker for the real token pairs used in the UI.
const lum = (h) => { const c = [1,3,5].map(i => parseInt(h.slice(i,i+2),16)/255).map(v => v<=0.03928 ? v/12.92 : ((v+0.055)/1.055)**2.4); return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2] }
const ratio = (a,b) => { const [x,y] = [lum(a),lum(b)].sort((p,q)=>q-p); return (x+0.05)/(y+0.05) }
const T = {
  light: { bg:'#F5F5EF', surface:'#FFFEFA', subtle:'#EBEEE7', fg:'#17251F', fg2:'#405248', muted:'#596C60', border:'#687C6F', primary:'#155C45', onPrimary:'#FFFFFF', link:'#155C45', selected:'#E3EEE7', mint:'#D7E6DA', warn:'#FEF3C7', warnFg:'#78350F', danger:'#B91C1C', dangerBg:'#FEE2E2', t1:'#E4ECE2', t2:'#EFECE1', t3:'#E7ECE9', t4:'#F1E9D8', deep:'#183F32', iris:'#6B3FB0', irisS:'#EFE9F9', azure:'#1F6AA5', azureS:'#E1EEF7', amberInk:'#7A4A12', amberS:'#F1E9D8' },
  dark:  { bg:'#111916', surface:'#18231E', subtle:'#202D27', fg:'#F0F2EA', fg2:'#CBD5CC', muted:'#A8B5AA', border:'#829388', primary:'#28734F', onPrimary:'#FFFFFF', link:'#9BCBB0', selected:'#223A2E', mint:'#2B4034', warn:'#3B2D18', warnFg:'#F2CF8B', danger:'#F2A09A', dangerBg:'#442421', t1:'#21382D', t2:'#34372D', t3:'#263630', t4:'#3B3324', deep:'#102B22', iris:'#C2A8F2', irisS:'#2E2450', azure:'#8FC5EA', azureS:'#1D3447', amberInk:'#D8AC69', amberS:'#3B3324' },
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
    ['violet on surface', t.iris, t.surface, 4.5], ['violet on violet tint', t.iris, t.irisS, 4.5], ['azure on surface', t.azure, t.surface, 4.5], ['azure on azure tint', t.azure, t.azureS, 4.5], ['amber ink on surface', t.amberInk, t.surface, 4.5], ['amber ink on amber tint', t.amberInk, t.amberS, 4.5], ['text on amber tint (highlight)', t.fg, t.amberS, 4.5],
    ['white on deep CTA', '#FFFFFF', t.deep, 4.5], ['white 90% on deep CTA', '#E6EFEC', t.deep, 4.5],
    ['control border on surface (3:1)', t.border, t.surface, 3], ['primary button vs page bg (3:1)', t.primary, t.bg, 3],
  ]
  for (const [label,a,b,min] of pairs) { const r = ratio(a,b); const ok = r>=min; if(!ok) fail++; console.log(`${name.padEnd(5)} ${ok?'PASS':'FAIL'} ${r.toFixed(2).padStart(5)}  (need ${min})  ${label}`) }
}
console.log('\n#22C55E on white (decorative only, never text):', ratio('#22C55E','#FFFFFF').toFixed(2))
process.exit(fail?1:0)
