// app.js — logique pour charger et filtrer le CSV
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

  // parse PapaParse result
  function onParsed(result) {
    if (result.errors && result.errors.length) {
      console.warn('Erreurs de parsing', result.errors);
    }
    rows = result.data.filter(r => Object.keys(r).length > 0);
    headers = result.meta.fields || (rows[0] ? Object.keys(rows[0]) : []);
    setStatus(`Fichier chargé — ${rows.length} lignes, ${headers.length} colonnes.`);
    populateColumns();
    enableSearchIfReady();
    renderTable([]); // vider résultats
  }

  // Charger via input file
  fileInput.addEventListener('change', e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setStatus(`Parsing "${f.name}"...`);
    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: onParsed,
      error: (err) => setStatus('Erreur lors du parsing: ' + err.message)
    });
  });

  // Tentative de fetch du fichier dans le même dossier
  loadRemoteBtn.addEventListener('click', async () => {
    const remoteName = 'Referentiel - Copie.csv';
    setStatus(`Récupération de "${remoteName}"...`);
    try {
      const res = await fetch(remoteName);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: onParsed,
        error: (err) => setStatus('Erreur lors du parsing: ' + err.message)
      });
    } catch (err) {
      setStatus(`Impossible de récupérer le fichier: ${err.message}. Vous pouvez charger un fichier localement.`);
    }
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

  // astuce: si l'utilisateur dépose le CSV sur la page (drag & drop)
  window.addEventListener('dragover', e => e.preventDefault());
  window.addEventListener('drop', e => {
    e.preventDefault();
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f && f.name.toLowerCase().endsWith('.csv')) {
      setStatus(`Fichier déposé: ${f.name} — parsing...`);
      Papa.parse(f, { header: true, skipEmptyLines: true, complete: onParsed });
    }
  });

  // message initial
  setStatus('Prêt. Chargez un fichier CSV ou cliquez sur "Charger Referentiel - Copie.csv".');
})();