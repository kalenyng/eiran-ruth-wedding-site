const SHEET_ID = '1oPB6ckeaknkhNXiRgZv_3hWtEAsGnkyJ1ewSrIPp1Vs';
const RANGE    = encodeURIComponent("'Form Responses 1'!B2:C");
const API_KEY  = 'AIzaSyC5JxQdHdu9tWEw9Nefeb12k6RwZ2vPZAA';

/* 1️⃣  unchanged – get rows */
async function fetchPhotoEntries() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error('Sheets API error: ' + data.error.message);
    return (data.values || []).map(([link, caption]) => ({ link, caption }));
}

/* 2️⃣  return Drive *preview* link for iframe */
function toPreviewURL(driveLink){
    // works for …/file/d/FILE_ID/…  or …open?id=FILE_ID…
    const id =
        driveLink.match(/\/d\/([a-zA-Z0-9_-]{25,})/)?.[1] ||
        driveLink.match(/[?&]id=([a-zA-Z0-9_-]{25,})/)?.[1];
    return id ? `https://drive.google.com/file/d/${id}/preview` : null;
}

async function renderGallery(){
    const gallery = document.getElementById('gallery');
    const entries = await fetchPhotoEntries();

    entries.forEach(({ link, caption })=>{
        const src = toPreviewURL(link);
        if (!src) return;

        /* 3️⃣  create iframe instead of img */
        const frame = document.createElement('iframe');
        frame.src  = src;
        frame.width  = 250;
        frame.height = 180;
        frame.loading = 'lazy';
        frame.style.border = '0';
        frame.style.borderRadius = '8px';

        const wrap = document.createElement('div');
        wrap.style.textAlign = 'center';
        wrap.style.margin = '10px';

        if (caption){
            const cap = document.createElement('p');
            cap.textContent = caption;
            cap.style.fontSize = '0.9rem';
            cap.style.marginTop = '0.4rem';
            wrap.appendChild(frame);
            wrap.appendChild(cap);
        } else {
            wrap.appendChild(frame);
        }

        gallery.appendChild(wrap);
    });
}

document.addEventListener('DOMContentLoaded', renderGallery);
