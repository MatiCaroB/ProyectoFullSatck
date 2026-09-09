//dios kiera que funcione
const REGIONES_COMUNAS = [
  {
    region: 'Región Metropolitana de Santiago',
    comunas: ['Santiago', 'Providencia', 'Las Condes', 'Maipú', 'La Florida', 'Ñuñoa', 'Puente Alto']
  },
  {
    region: 'Región de la Araucanía',
    comunas: ['Temuco', 'Villarrica', 'Angol', 'Pucón', 'Victoria']
  },
  {
    region: 'Región de Ñuble',
    comunas: ['Chillán', 'Chillán Viejo', 'San Carlos', 'Quirihue']
  }
];

/**
 * algo de llenar un selec con la lista de regiones disponibles.
 * @param {HTMLSelectElement} selectRegion
 */
function poblarSelectRegiones(selectRegion) {
  if (!selectRegion) return;
  selectRegion.innerHTML = '<option value="">-- Seleccione la región --</option>';
  REGIONES_COMUNAS.forEach((r) => {
    const opt = document.createElement('option');
    opt.value = r.region;
    opt.textContent = r.region;
    selectRegion.appendChild(opt);
  });
}

/**
 * llena selec con la comuna elejida.
 * @param {HTMLSelectElement} selectComuna
 * @param {string} nombreRegion
 */
function poblarSelectComunas(selectComuna, nombreRegion) {
  if (!selectComuna) return;
  selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
  const region = REGIONES_COMUNAS.find((r) => r.region === nombreRegion);
  if (!region) {
    selectComuna.disabled = true;
    return;
  }
  selectComuna.disabled = false;
  region.comunas.forEach((c) => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    selectComuna.appendChild(opt);
  });
}