// app.js — logique pour charger et filtrer Excel (.xlsx/.xls/.xlsb) et CSV
(() => {
  const fileInput = document.getElementById('file');
  const loadRemoteBtn = document.getElementById('load-remote');
  const status = document.getElementById('status');
  const col1 = document.getElementById('col1');
  const col2 = document.getElementById('col2');
  const val1 = document.getElementById('val1');
  const val2 = document.getElementById('val2');
  const searchBtn = document.getElementById('search');
  const clearBtn = document.getElementById('clear');
  const useExact = document.getElementById('useExact');
  const tableWrap = document.getElementById('table-wrap');
  const countSpan = document.getElementById('count');

  let rows = []; // données après parsing (array d'objets)
  let headers = [];

  function setStatus(txt) { status.textContent = txt; }

  function populateColumns() {
    [col1, col2].forEach(s => {
      s.innerHTML = '';
      headers.forEach(h => {
        const opt = document.createElement('option');
        opt.value = h;
        opt.textContent = h;
        s.appendChild(opt);
      });
    });
  }

  function renderTable(filtered) {
    tableWrap.innerHTML = '';
    countSpan.textContent = `(${filtered.length})`;
    if (!filtered.length) {
      tableWrap.textContent = 'Aucun résultat.';
      return;
    }
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    headers.forEach(h => {
      const th = document.createElement('th');
      th.textContent = h;
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    filtered.forEach(r => {
      const tr = document.createElement('tr');
      headers.forEach(h => {
        const td = document.createElement('td');
        td.textContent = r[h] ?? '';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
  }

  function filterRows() {
    const c1 = col1.value;
    const c2 = col2.value;
    const v1 = val1.value.trim();
    const v2 = val2.value.trim();
    if (!c1 || !c2) return [];
    const exact = useExact.checked;

    const filtered = rows.filter(r => {
      const a = (r[c1] ?? '');
      const b = (r[c2] ?? '');
      if (exact) {
        return a === v1 && b === v2;
      } else {
        const la = a.toString().toLowerCase();
        const lb = b.toString().toLowerCase();
        const q1 = v1.toLowerCase();
        const q2 = v2.toLowerCase();
        return la.includes(q1) && lb.includes(q2);
      }
    });
    return filtered;
  }

  function enableSearchIfReady() {
    searchBtn.disabled = !(rows.length && col1.value && col2.value);
  }

  // traitement après parsing commun
  function onParsedData(dataArray, infoMsg) {
    rows = dataArray.filter(r => Object.keys(r).length > 0);
    headers = Array.from(new Set(rows.flatMap(r => Object.keys(r))));
    setStatus(`${infoMsg} — ${rows.length} lignes, ${headers.length} colonnes.`);
    populateColumns();
    enableSearchIfReady();
    renderTable([]); // vider résultats
  }

  // --- Parsing Excel via SheetJS ---
  async function parseExcelFile(file) {
    setStatus(`Lecture du fichier Excel "${file.name}"...`);
    const arrayBuffer = await file.arrayBuffer();
    const wb = XLSX.read(arrayBuffer, { type: 'array' });
    // on prend la première feuille par défaut
    const firstName = wb.SheetNames[0];
    const ws = wb.Sheets[firstName];
    const data = XLSX.utils.sheet_to_json(ws, { defval: '' }); // array d'objets
    onParsedData(data, `Fichier Excel "${file.name}" chargé (feuille: ${firstName})`);
  }

  async function parseExcelFromArrayBuffer(buffer, filename = 'remote.xlsx') {
    const wb = XLSX.read(buffer, { type: 'array' });
    const firstName = wb.SheetNames[0];
    const ws = wb.Sheets[firstName];
    const data = XLSX.utils.sheet_to_json(ws, { defval: '' });
    onParsedData(data, `Fichier Excel "${filename}" chargé (feuille: ${firstName})`);
  }

  // --- Parsing CSV via PapaParse (compatibilité) ---
  function parseCsvText(text, filename = 'remote.csv') {
    setStatus(`Parsing CSV "${filename}"...`);
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.errors && result.errors.length) console.warn('Erreurs CSV', result.errors);
        onParsedData(result.data, `Fichier CSV "${filename}" chargé`);
      },
      error: (err) => setStatus('Erreur lors du parsing CSV: ' + err.message)
    });
  }

  // Charger via input file
  fileInput.addEventListener('change', async e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const name = f.name.toLowerCase();
    try {
      if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.xlsb')) {
        await parseExcelFile(f);
      } else if (name.endsWith('.csv')) {
        setStatus(`Parsing CSV "${f.name}"...`);
        Papa.parse(f, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            if (result.errors && result.errors.length) console.warn('Erreurs CSV', result.errors);
            onParsedData(result.data, `Fichier CSV "${f.name}" chargé`);
          },
          error: (err) => setStatus('Erreur lors du parsing CSV: ' + err.message)
        });
      } else {
        setStatus('Type de fichier non supporté. Utilisez .xlsx, .xls, .xlsb ou .csv');
      }
    } catch (err) {
      setStatus('Erreur lors de la lecture du fichier: ' + err.message);
    }
  });

  // Tentative de fetch du fichier dans le même dossier :
  // on essaie d'abord .xlsx puis fallback .csv
  loadRemoteBtn.addEventListener('click', async () => {
    const base = 'Referentiel - Copie';
    const candidates = [`${base}.xlsx`, `${base}.xls`, `${base}.xlsb`, `${base}.csv`];
    setStatus(`Récupération distante : tentative de ${candidates.join(', ')}...`);
    for (const name of candidates) {
      try {
        const res = await fetch(name);
        if (!res.ok) {
          // essayer le suivant
          continue;
        }
        const contentType = res.headers.get('content-type') || '';
        if (name.endsWith('.csv') || contentType.includes('text/csv')) {
          const text = await res.text();
          parseCsvText(text, name);
          return;
        } else {
          // lire en arrayBuffer et parser via SheetJS
          const buffer = await res.arrayBuffer();
          await parseExcelFromArrayBuffer(buffer, name);
          return;
        }
      } catch (err) {
        // ignorer et essayer le suivant
        console.warn(`Échec fetch ${name}:`, err);
      }
    }
    setStatus('Impossible de récupérer le fichier distant (essayé .xlsx, .xls, .xlsb, .csv). Chargez un fichier localement.');
  });

  // Recherche
  searchBtn.addEventListener('click', () => {
    const results = filterRows();
    renderTable(results);
    setStatus(`Recherche terminée — ${results.length} résultat(s).`);
  });

  // Effacer
  clearBtn.addEventListener('click', () => {
    val1.value = '';
    val2.value = '';
    tableWrap.innerHTML = '';
    countSpan.textContent = `(0)`;
    setStatus('Filtres réinitialisés.');
  });

  // activation bouton recherche lors du choix des colonnes
  [col1, col2].forEach(s => s.addEventListener('change', enableSearchIfReady));

  // drag & drop (compatibilité CSV/Excel)
  window.addEventListener('dragover', e => e.preventDefault());
  window.addEventListener('drop', async e => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!f) return;
    const name = f.name.toLowerCase();
    try {
      if (name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.xlsb')) {
        setStatus(`Fichier déposé: ${f.name} — lecture Excel...`);
        await parseExcelFile(f);
      } else if (name.endsWith('.csv')) {
        setStatus(`Fichier déposé: ${f.name} — parsing CSV...`);
        Papa.parse(f, { header: true, skipEmptyLines: true, complete: (result) => onParsedData(result.data, `Fichier CSV "${f.name}" chargé`) });
      } else {
        setStatus('Type de fichier non supporté pour le drag & drop. Utilisez .xlsx, .xls, .xlsb ou .csv');
      }
    } catch (err) {
      setStatus('Erreur lors du traitement du fichier déposé: ' + err.message);
    }
  });

  // message initial
  setStatus('Prêt. Chargez un fichier Excel (.xlsx/.xls/.xlsb) ou CSV, ou cliquez sur "Charger Referentiel - Copie.xlsx".');
})();