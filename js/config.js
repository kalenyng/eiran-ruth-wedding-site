const SHEET_ID = '1oPB6ckeaknkhNXiRgZv_3hWtEAsGnkyJ1ewSrIPp1Vs';
const RANGE = encodeURIComponent("'Form Responses 1'!B2:C");
const API_KEY = 'AIzaSyC5JxQdHdu9tWEw9Nefeb12k6RwZ2vPZAA'; // Replace this!

async function fetchPhotoEntries() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    console.log('Google Sheets response:', data);

    if (data.error) {
        throw new Error('Sheets API error: ' + data.error.message);
    }

    return (data.values || []).map(([link, caption]) => ({ link, caption }));
}

function toImageURL(link) {
    if (!link) return null;

    const id =
        link.match(/\/d\/([^/]+)\//)?.[1] ||     // matches /d/FILE_ID/
        link.match(/[?&]id=([^&]+)/)?.[1];       // matches ?id=FILE_ID

    return id ? `https://drive.google.com/uc?id=${id}` : null;
}


async function renderGallery() {
    const gallery = document.getElementById('gallery');
    const entries = await fetchPhotoEntries(); // ✅ FIXED NAME HERE

    entries.forEach(({ link, caption }) => {
        const imgSrc = toImageURL(link);
        if (!imgSrc) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'photo-card';
        wrapper.style.textAlign = 'center';

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = caption || 'Wedding photo';
        img.style.width = '240px';
        img.style.borderRadius = '8px';
        img.loading = 'lazy';

        const captionEl = document.createElement('p');
        captionEl.textContent = caption || '';
        captionEl.style.fontSize = '0.9rem';
        captionEl.style.marginTop = '0.5rem';

        wrapper.appendChild(img);
        wrapper.appendChild(captionEl);
        gallery.appendChild(wrapper);
    });
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', renderGallery);