// Product definitions for all fertilizer sections

export const seedTreatmentProducts = [
  { value: 'root-shoot', label: 'Root & Shoot', defaultRate: '3-4', defaultUnit: 'L/tonne of seed', contains: ['N', 'P', 'K', 'Trace Elements'], nutrientPercents: ['N 10%', 'P 5%', 'K 8%', 'Trace Elements 2%'] },
  { value: 'nutri-bam', label: 'Nutri-Life BAM', defaultRate: '5', defaultUnit: 'L/tonne of seed', contains: ['Beneficial Microbes'], nutrientPercents: ['Beneficial Microbes'] },
  { value: 'nutri-platform', label: 'Nutri-Life Platform', defaultRate: '1.3', defaultUnit: 'kg/tonne of seed', contains: ['Beneficial Microbes'], nutrientPercents: ['Beneficial Microbes'] },
  { value: 'mycorrhizal', label: 'Mycorrhizal Inoculant', defaultRate: '10', defaultUnit: 'g/ha', contains: ['Mycorrhizae'], nutrientPercents: ['Mycorrhizae'] },
  { value: 'rhizobium', label: 'Rhizobium Bacteria', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Rhizobium'], nutrientPercents: ['Rhizobium'] },
  { value: 'biochar', label: 'Biochar Coating', defaultRate: '2', defaultUnit: 'kg/ha', contains: ['Biochar'], nutrientPercents: ['Biochar'] },
  { value: 'trichoderma', label: 'Trichoderma Fungi', defaultRate: '8', defaultUnit: 'g/ha', contains: ['Trichoderma'], nutrientPercents: ['Trichoderma'] },
  { value: 'bacillus-subtilis', label: 'Bacillus subtilis', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Bacillus subtilis'], nutrientPercents: ['Bacillus subtilis'] },
  { value: 'pseudomonas-fluorescens', label: 'Pseudomonas fluorescens', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Pseudomonas fluorescens'], nutrientPercents: ['Pseudomonas fluorescens'] },
  { value: 'azospirillum', label: 'Azospirillum', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Azospirillum'], nutrientPercents: ['Azospirillum'] },
  { value: 'azotobacter', label: 'Azotobacter', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Azotobacter'], nutrientPercents: ['Azotobacter'] },
  { value: 'phosphobacteria', label: 'Phosphobacteria', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Phosphobacteria'], nutrientPercents: ['Phosphobacteria'] },
  { value: 'actinomycetes', label: 'Actinomycetes', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Actinomycetes'], nutrientPercents: ['Actinomycetes'] },
  { value: 'streptomyces', label: 'Streptomyces', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Streptomyces'], nutrientPercents: ['Streptomyces'] },
  { value: 'frankia', label: 'Frankia', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Frankia'], nutrientPercents: ['Frankia'] },
  { value: 'penicillium', label: 'Penicillium', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Penicillium'], nutrientPercents: ['Penicillium'] },
  { value: 'aspergillus', label: 'Aspergillus', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Aspergillus'], nutrientPercents: ['Aspergillus'] },
  { value: 'phosphate-solubilizing-bacteria', label: 'Phosphate Solubilizing Bacteria', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Phosphate Solubilizing Bacteria'], nutrientPercents: ['Phosphate Solubilizing Bacteria'] },
  { value: 'potassium-solubilizing-bacteria', label: 'Potassium Solubilizing Bacteria', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Potassium Solubilizing Bacteria'], nutrientPercents: ['Potassium Solubilizing Bacteria'] },
  { value: 'silicate-solubilizing-bacteria', label: 'Silicate Solubilizing Bacteria', defaultRate: '5', defaultUnit: 'g/ha', contains: ['Silicate Solubilizing Bacteria'], nutrientPercents: ['Silicate Solubilizing Bacteria'] }
];

export const productList = [
  { label: 'K-Rich™', nutrientContent: { Potassium: 33.29 }, description: 'A pH-buffered liquid potassium citrate designed for foliar application during fruit/seed fill. Its citrate form enhances potassium uptake and rapidly corrects deficiencies.' },
  { label: 'Cal-Tech™', nutrientContent: { Nitrogen: 11.71, Boron: 0.43, Calcium: 13.36 }, description: 'An amino-chelated liquid calcium product with added boron, nitrogen, trace elements, and vitamin B12. Enhances cell wall strength, fruit quality, and disease resistance.' },
  { label: 'Calcium Fulvate™', nutrientContent: { Nitrogen: 6.78, Sulphur: 0.54, Boron: 0.0207, Calcium: 8.93, Copper: 0.0785, Zinc: 0.0807, Iron: 0.17, Potassium: 1.32, Manganese: 0.21, Molybdenum: 0.0102 }, description: 'Chelated calcium with fulvic acid, enhanced with a broad spectrum of trace minerals. Improves nutrient delivery, uptake, and overall plant resilience.' },
  { label: 'Citrus-Tech Triple Ten™', nutrientContent: { Nitrogen: 10.48, Sulphur: 0.22, Boron: 0.0347, Calcium: 0.0558, Copper: 0.0197, Phosphorus: 10.23, Zinc: 0.0743, Iron: 0.1459, Potassium: 10.69, Manganese: 0.0607, Molybdenum: 0.0039, Selenium: 0.0198 }, description: 'A full-spectrum NPK foliar formula (10-10-10) enriched with trace elements, seaweed extract, fulvic acid, and vitamins. Optimized for citrus quality and yield.' },
  { label: 'Cloak Spray Oil™', nutrientContent: {} },
  { label: 'Nutri-Carb-N™', nutrientContent: { Nitrogen: 15.18, Potassium: 1.1 } },
  { label: 'Phos-Force™', nutrientContent: { Nitrogen: 4.2, Calcium: 4.3, Phosphorus: 14.3, Iron: 3.5 } },
  { label: 'Photo-Finish™', nutrientContent: { Potassium: 10.6, Silicon: 10.38 } },
  { label: 'Potassium Silicate™', nutrientContent: { Potassium: 15.3, Silicon: 17.3 } },
  { label: 'Seed-Start™', nutrientContent: {} },
  { label: 'Trio (CMB)™', nutrientContent: { Nitrogen: 13.73, Boron: 0.26, Magnesium: 2.38, Calcium: 15.3, Zinc: 0.006, Iron: 0.1 } },
  { label: 'Triple Ten™', nutrientContent: { Nitrogen: 10.48, Sulphur: 0.22, Boron: 0.0347, Calcium: 0.0558, Copper: 0.0197, Phosphorus: 10.23, Zinc: 0.0743, Iron: 0.1459, Potassium: 10.69, Manganese: 0.0607, Molybdenum: 0.0039, Selenium: 0.0198 }, description: 'A state‑of‑the‑art 10‑10‑10 liquid fertiliser combining hot‑mix NPK with chelated trace elements, fulvic acid, seaweed, vitamins, amino acids, saponins and triacontanol – designed to boost vigour, yield, taste and shelf‑life across all crops.' },
  { label: 'Tsunami™ Super Spreader', nutrientContent: {}, description: 'A patented silicon‑based non‑ionic wetter/spreader that dramatically improves spray coverage and uptake, especially on hard‑to‑wet leaf surfaces, boosting foliar fertiliser efficiency and crop yield.' },
  { label: 'Activated Char Condensate (ACC)™', nutrientContent: {}, description: 'A breakthrough wood‑vinegar (smoke condensate from biochar) using LipoZoom liposomal technology. Rich in karrikins, phenolics and biochar nanoparticles to boost germination, pest resistance, microbial soil life, foliar uptake and post‑harvest shelf‑life. Suitable as soil, foliar or seed treatment; organic‑certified.' },
  { label: 'Aloe-Tech™', nutrientContent: {}, description: 'A natural aloe‑based plant and microbial promotant, designed to enhance soil biology, stress resilience and plant vigour. (Listed in the ‘Natural Soil‑Life & Plant Growth Promoters’ collection.)' },
  { label: 'Amino-Max™', nutrientContent: { Nitrogen: 5.78, 'Amino Acids': 40 }, description: 'A high‑amino acid concentrate delivering 40% amino acids and 5.78% nitrogen. Ideal for supporting plant metabolism, stress recovery and microbial stimulation. Featured in the soil‑life promoters range.' },
  { label: 'Brix-Fix™', nutrientContent: {}, description: 'A liquid concentrate of seven plant growth promotants designed to increase Brix (sugar) levels in crops. Part of Nutri‑Tech’s Natural Soil‑Life & Plant Growth Promoters range.' },
  { label: 'Nutri-Kelp™', nutrientContent: {}, description: 'A premium seaweed‑derived plant growth promoter, rich in natural biostimulants. Listed in the Natural Soil‑Life & Plant Growth Promoters collection.' },
  { label: 'Nutri-Sea Liquid Fish™', nutrientContent: {}, description: 'A liquid fish‑based fertiliser and microbial stimulant, included in the Natural Soil‑Life & Plant Growth Promoters.' },
  { label: 'Nutri-Stim Saponins™', nutrientContent: {}, description: 'A saponin‑rich biostimulant formulation designed to stimulate soil microbes and enhance plant root activity. Sold under the Natural Soil‑Life & Plant Growth Promoters line.' },
  { label: 'Nutri-Stim Triacontanol™', nutrientContent: {}, description: 'A natural plant growth promoter based on triacontanol, included in the soil‑life promoter range to enhance growth and yield.' },
  { label: 'Nutri-Tech Black Gold®', nutrientContent: {}, description: 'A liquid soil‑life and plant growth promoter designed to build Brix, improve stress and frost resistance. Sourced from the Natural Soil‑Life & Plant Growth Promoters collection.' },
  { label: 'Root & Shoot™', nutrientContent: {}, description: 'A biological seed treatment containing beneficial microbes and biostimulants to enhance root development, early vigor, and plant resilience. Promotes strong germination and supports early plant health for improved crop establishment.' },
  { label: 'Nutri-Life BAM', nutrientContent: {}, description: 'A source of beneficial anaerobic (facultative) microbes that can increase organic matter decomposition levels and nutrient cycling, also helping enhance plant resilience.' },
  { label: 'Nutri-Life Platform', nutrientContent: {}, description: 'A Mycorrhizal fungi inoculum, also containing other beneficial microbes such as Trichoderma, enhancing nutrient uptake, root health, and plant resilience.' },
  { label: 'SeaChange KFF™', nutrientContent: {}, description: 'A kelp-based liquid fertiliser (SeaChange range) enriched with kelp biostimulants to boost plant health, stress resilience, and crop performance.' },
  { label: 'SeaChange Liquid Kelp™', nutrientContent: {}, description: 'Premium liquid seaweed extract providing natural growth regulators and micronutrients to enhance soil biology, drought resistance, and overall plant vigor.' },
  { label: 'Tri-Kelp™', nutrientContent: {}, description: 'A soluble kelp powder seed treatment featuring three types of kelp to improve germination, root and shoot growth, and stimulate beneficial soil microbes.' },
  { label: 'Nutri-Key Boron Shuttle™', nutrientContent: { Nitrogen: 0.29, Sulphur: 0.53, Boron: 3.61, Magnesium: 0.0938, Copper: 0.049, Zinc: 0.19, Iron: 0.31, Potassium: 0.51, Manganese: 0.15, Molybdenum: 0.0098, Carbon: 3.38 }, description: 'A foliar chelated boron formulation with 3.6 % B plus background nutrition. Enhances flowering, fruit‑set, calcium synergy, and pollen viability through Shuttle® chelation.' },
  { label: 'Nutri-Key Calcium Shuttle™', nutrientContent: { Nitrogen: 7.25, Sulphur: 0.26, Boron: 0.0433, Magnesium: 0.0363, Calcium: 9.81, Copper: 0.0245, Zinc: 0.093, Iron: 0.15, Potassium: 0.23, Manganese: 0.0757, Molybdenum: 0.0049, Silicon: 0.0217, Carbon: 5.27 }, description: 'A chelated calcium foliar using Shuttle® technology. Delivers ~10 % Ca with full-spectrum background nutrition to enhance cell‑wall strength, fruit quality and storage life.' },
  { label: 'Nutri-Key Cobalt Shuttle™', nutrientContent: { Cobalt: 3.1, Zinc: 2.8 }, description: 'A foliar chelated cobalt formulation with 3.1 % Co and 2.8 % Zn, designed to address cobalt deficiencies important for nitrogen-fixing legumes and seed formation.' },
  { label: 'Nutri-Key Copper Shuttle™', nutrientContent: { Nitrogen: 0.52, Sulphur: 4.29, Boron: 0.0866, Magnesium: 0.0675, Copper: 7.64, Zinc: 0.19, Iron: 0.31, Potassium: 0.27, Manganese: 0.15, Molybdenum: 0.0098, Carbon: 4.62 }, description: 'A foliar copper formulation with 7.6 % Cu and support nutrients. Chelated to reduce antagonism, improve uptake, and strengthen cell walls and seed health.' },
  { label: 'Nutri-Key Hydro-Shuttle™', nutrientContent: { Nitrogen: 2.14, Carbon: 21.15 }, description: 'A carbohydrate-rich chelator (Hydro-Shuttle®) delivering ~21% C with moderate N—used to support foliar nutrient uptake and microbial life on leaf surfaces.' },
  { label: 'Nutri-Key Iron Shuttle™', nutrientContent: { Nitrogen: 0.52, Sulphur: 4.41, Boron: 0.0866, Magnesium: 0.0678, Copper: 0.049, Zinc: 0.19, Iron: 7.21, Potassium: 0.34, Manganese: 0.15, Molybdenum: 0.0098, Carbon: 4.38 }, description: 'A chelated iron foliar (~7.2 % Fe) with background nutrients. Designed to correct iron deficiencies efficiently in foliar applications.' },
  { label: 'Nutri-Key Magnesium Shuttle™', nutrientContent: { Nitrogen: 0.45, Sulphur: 6.24, Boron: 0.0866, Magnesium: 4.44, Copper: 0.049, Zinc: 0.19, Iron: 0.31, Potassium: 0.31, Manganese: 0.15, Molybdenum: 0.0098, Carbon: 3.9 }, description: 'A foliar Mg application (~4.4 % Mg) with supporting macro and micro nutrients. Shuttle® chelation helps uptake and prevents antagonism.' },
  { label: 'Nutri-Key Manganese Shuttle™', nutrientContent: { Nitrogen: 0.53, Sulphur: 8.15, Boron: 0.0866, Magnesium: 0.0675, Copper: 0.049, Zinc: 0.19, Iron: 0.31, Potassium: 0.27, Manganese: 13.19, Molybdenum: 0.0098, Carbon: 4.7 }, description: 'A foliar Mn formulation (~13.2 % Mn) with chelated nutrients. Shuttle® technology boosts uptake efficiency to correct deficiencies and support plant metabolism.' },
  { label: 'Nutri-Key Moly Shuttle™', nutrientContent: { Nitrogen: 0.18, Molybdenum: 4.76, Carbon: 1.6 }, description: 'A foliar Mo product (~4.8 % Mo) using Shuttle® chelation. Enhances enzyme systems and nitrogen metabolism, especially for legumes.' },
  { label: 'Nutri-Key Shuttle Seven™', nutrientContent: { Nitrogen: 0.43, Sulphur: 4.72, Boron: 0.87, Magnesium: 0.67, Cobalt: 0.000034, Copper: 0.49, Zinc: 1.86, Iron: 3.06, Potassium: 2.63, Manganese: 1.51, Molybdenum: 0.000975, Selenium: 0.43, Carbon: 3.04 }, description: 'Seven-nutrient foliar complex combining B, Cu, Fe, Mn, Mo, Se, Zn using Shuttle® chelation — ideal for correcting multiple trace deficiencies in a single spray.' },
  { label: 'Nutri-Key Zinc Shuttle™', nutrientContent: { Nitrogen: 0.73, Sulphur: 4.35, Boron: 0.0866, Magnesium: 0.0675, Copper: 0.049, Zinc: 8.17, Iron: 0.31, Potassium: 0.27, Manganese: 0.15, Molybdenum: 0.0098, Carbon: 6.54 }, description: 'A foliar Zn product (~8.2 % Zn) with supporting nutrition for optimal uptake and correction of zinc deficiencies.' },
  { label: 'Boron Essentials™', nutrientContent: { Nitrogen: 0.05, Boron: 3.09, Zinc: 0.04 }, description: 'A foliar boron spray (~3 % B) with minimal N and Zn. Designed for precise B correction during flowering and fruit-set.' },
  { label: 'Copper Essentials™', nutrientContent: { Nitrogen: 0.12, Sulphur: 2.55, Magnesium: 0.0352, Calcium: 0.0247, Copper: 4.9, Potassium: 0.14 }, description: 'A foliar copper spray (~4.9 % Cu) with support nutrients. Targets copper deficiencies affecting disease resistance and quality.' },
  { label: 'Iron Essentials™', nutrientContent: { Nitrogen: 0.12, Sulphur: 3.49, Magnesium: 0.0351, Calcium: 0.0247, Iron: 6, Potassium: 0.14 }, description: 'A pure iron foliar (~6 % Fe) with minimal support nutrients to quickly correct chlorosis and boost photosynthesis.' },
  { label: 'Manganese Essentials™', nutrientContent: { Nitrogen: 0.12, Sulphur: 6.52, Magnesium: 0.0352, Calcium: 0.0247, Manganese: 0.13, Silicon: 10.96 }, description: 'A foliar manganese spray (~0.13 % Mn) with silicon booster. Ideal for seed/grain crops prone to Mn deficiency.' },
  { label: 'Multi-Boost™', nutrientContent: { Nitrogen: 2.29, Sulphur: 6.2, Boron: 0.033, Magnesium: 0.64, Calcium: 5.96, Copper: 0.0245, Phosphorus: 0.29, Zinc: 0.0536, Iron: 0.0708, Potassium: 0.66, Manganese: 0.0483, Molybdenum: 0.013 }, description: 'A multi-nutrient foliar blend with balanced macro and micro elements to deliver broad corrective nutrition.' },
  { label: 'Multi-Min™', nutrientContent: { Nitrogen: 4.24, Sulphur: 4.12, Boron: 0.2, Magnesium: 1.49, Calcium: 0.0186, Copper: 0.78, Phosphorus: 0.17, Zinc: 0.81, Iron: 1.44, Potassium: 2.45, Manganese: 2.05, Molybdenum: 0.1 }, description: 'A comprehensive foliar multi-mineral spray for crop conditions requiring mid-level correction across many nutrients.' },
  { label: 'Multi-Plex™', nutrientContent: { Nitrogen: 10.22, Sulphur: 0.23, Boron: 0.0347, Copper: 0.0198, Phosphorus: 10.09, Zinc: 0.0743, Iron: 0.14, Potassium: 10.04, Manganese: 0.0607, Molybdenum: 0.0039 }, description: 'A powerful corrective spray (10‑10 NPK plus micro-trace) for comprehensive foliar nutrition in high-yield crops.' },
  { label: 'Zinc Essentials™', nutrientContent: { Nitrogen: 0.12, Sulphur: 3.95, Magnesium: 0.0351, Calcium: 0.0247, Zinc: 7.95, Iron: 0.14 }, description: 'A herbaceous foliar zinc spray (~8 % Zn) with supporting nutrients, tailored to correct zinc deficiencies affecting grain and legume development.' },
  { label: 'CalMag-Life Organic™', nutrientContent: { Magnesium: 9.68, Calcium: 20.26 }, description: 'An organic Ca–Mg blend derived from natural minerals to improve soil structure and correct acidic soil deficiencies.' },
  { label: 'Dia-Life Organic™', nutrientContent: { Boron: 0.68, Magnesium: 0.0277, Calcium: 0.16, Iron: 0.32, Silicon: 12.51 }, description: 'A diatomaceous earth-based mineral blend providing bioavailable silica plus trace nutrients to boost plant and soil resilience.' },
  { label: 'Gyp-Life Organic™', nutrientContent: { Sulphur: 15.31, Calcium: 19.55 }, description: 'A soluble gypsum product delivering sulfur and calcium to improve soil structure, correct subsoil acidity and enhance root development.' },
  { label: 'Lime-Life Organic™', nutrientContent: { Magnesium: 1.05, Calcium: 39.37 }, description: 'A finely ground organic lime that corrects soil pH while supplying calcium and magnesium for improved fertility.' },
  { label: 'Mag-Life Organic™', nutrientContent: { Magnesium: 21.33 }, description: 'A high-magnesium organic mineral to correct soil Mg deficiencies and support chlorophyll formation.' },
  { label: 'Phos-Life Organic™', nutrientContent: { Magnesium: 0.34, Calcium: 24.56, Copper: 0.0162, Phosphorus: 10.71, Zinc: 0.14, Iron: 0.86, Potassium: 0.15, Manganese: 1.66, Silicon: 10.73 }, description: 'A mineral phosphate product rich in phosphorus, calcium and silica—designed to boost root growth and soil fertility.' },
  { label: 'Sili-Cal (B)™', nutrientContent: { Sulphur: 0.13, Boron: 0.51, Magnesium: 0.64, Calcium: 21.59, Iron: 0.0861, Potassium: 0.23, Silicon: 3.34 }, description: 'A calcium–silicate–boron blend supplying cell wall strength, stress resistance and support for crop quality.' },
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatNutrientBreakdown(nutrientContent) {
  if (!nutrientContent || Object.keys(nutrientContent).length === 0) return '';
  return Object.entries(nutrientContent)
    .map(([nutrient, value]) => `${nutrient}: ${value}%`)
    .join(', ');
}

export const soilDrenchProducts = productList.map(product => ({
  ...product,
  value: slugify(product.label),
  defaultRate: '1',
  defaultUnit: 'L/ha',
  contains: [],
  nutrientPercents: [],
  nutrientBreakdown: formatNutrientBreakdown(product.nutrientContent),
}));

export const foliarSprayProducts = productList.map(product => ({
  ...product,
  value: slugify(product.label),
  defaultRate: '1',
  defaultUnit: 'L/ha',
  contains: [],
  nutrientPercents: [],
  nutrientBreakdown: formatNutrientBreakdown(product.nutrientContent),
}));

export const ammoniumNitrateFerts = [
  {
    name: "Calcium Nitrate",
    n_form: "Nitrate (NO₃⁻)",
    nitrate: 15.5,
    P2O5: 0,
    K2O: 0,
    Ca: 19,
    S: 0,
    Na: 0,
    Cl: 0,
    description: "Supplies fast-acting nitrate nitrogen and calcium. Used in fertigation and hydroponics."
  },
  {
    name: "Potassium Nitrate",
    n_form: "Nitrate (NO₃⁻)",
    nitrate: 13,
    P2O5: 0,
    K2O: 44,
    Ca: 0,
    S: 0,
    Na: 0,
    Cl: 0,
    description: "Provides nitrate and potassium. Ideal for fruiting/flowering crops."
  },
  {
    name: "Sodium Nitrate",
    n_form: "Nitrate (NO₃⁻)",
    nitrate: 16,
    P2O5: 0,
    K2O: 0,
    Ca: 0,
    S: 0,
    Na: 26,
    Cl: 0,
    description: "Known as Chilean nitrate. Fast-acting and approved for some organic systems."
  },
  {
    name: "Ammonium Nitrate",
    n_form: "NO₃⁻ + NH₄⁺",
    nitrate: 17,
    ammonium: 17,
    P2O5: 0,
    K2O: 0,
    Ca: 0,
    S: 0,
    Na: 0,
    Cl: 0,
    description: "Balanced source of nitrate and ammonium N. Restricted in some countries."
  },
  {
    name: "Ammonium Sulfate",
    n_form: "Ammonium (NH₄⁺)",
    ammonium: 21,
    P2O5: 0,
    K2O: 0,
    Ca: 0,
    S: 24,
    Na: 0,
    Cl: 0,
    description: "Provides ammonium N and sulfur. Useful for acidifying soil."
  },
  {
    name: "Anhydrous Ammonia",
    n_form: "Ammonium (via NH₃)",
    ammonium: 82,
    P2O5: 0,
    K2O: 0,
    Ca: 0,
    S: 0,
    Na: 0,
    Cl: 0,
    description: "Highest %N of any fertilizer. Injected into soil."
  },
  {
    name: "Aqua Ammonia",
    n_form: "Ammonium",
    ammonium: 22.5,
    P2O5: 0,
    K2O: 0,
    Ca: 0,
    S: 0,
    Na: 0,
    Cl: 0,
    description: "Liquid ammonia; used in irrigation or injection."
  },
  {
    name: "Ammonium Chloride",
    n_form: "Ammonium",
    ammonium: 26,
    P2O5: 0,
    K2O: 0,
    Ca: 0,
    S: 0,
    Na: 0,
    Cl: 66,
    description: "Boosts ammonium N; also supplies chloride. Used in cereals and rice."
  },
  {
    name: "DAP (Diammonium Phosphate)",
    n_form: "Ammonium",
    ammonium: 18,
    P2O5: 46,
    K2O: 0,
    Ca: 0,
    S: 0,
    Na: 0,
    Cl: 0,
    description: "Supplies both ammonium N and phosphorus. Common starter fertilizer."
  }
]; 