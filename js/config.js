document.addEventListener('DOMContentLoaded', () => {
    /* ---------- CONFIG ---------- */
    const SHEET_ID = '1oPB6ckeaknkhNXiRgZv_3hWtEAsGnkyJ1ewSrIPp1Vs';
    const RANGE    = encodeURIComponent("'Form Responses 1'!B2:C");  // link + caption
    const API_KEY  = 'AIzaSyC5JxQdHdu9tWEw9Nefeb12k6RwZ2vPZAA';

    /* ---------- Helpers ---------- */
    const toImageURL = url => {
        const m = url?.match(/\/d\/([^/]+)\//);
        return m ? `https://drive.google.com/uc?export=view&id=${m[1]}` : null;
    };

    async function fetchRows() {
        const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const r = await fetch(endpoint);
        if (!r.ok) throw new Error('Sheets API error');
        const j = await r.json();
        return (j.values || []).map(([link, caption]) => ({ link, caption }));
    }

    /* ---------- Render ---------- */
    async function renderGallery() {
        const gallery = document.getElementById('gallery');
        try {
            const rows = await fetchRows();
            rows.forEach(({ link, caption }) => {
                const src = toImageURL(link);
                if (!src) return;
                gallery.insertAdjacentHTML('beforeend', `
          <figure class="text-center">
            <img src="${src}" alt="${caption||'Wedding photo'}"
                 class="img-fluid rounded mb-2" style="max-width:240px" loading="lazy">
            ${caption ? `<figcaption class="small">${caption}</figcaption>` : ''}
          </figure>
        `);
            });
        } catch (err) {
            gallery.textContent = 'Unable to load photos 😢';
            console.error(err);
        }
    }

    renderGallery();
});