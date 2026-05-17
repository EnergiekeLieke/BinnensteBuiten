const API_URL = process.env.MAILBLUE_API_URL!;
const API_KEY  = process.env.MAILBLUE_API_KEY!;

const hdrs = {
  'Api-Token': API_KEY,
  'Content-Type': 'application/json',
};

async function syncContact(voornaam: string, email: string, stemmetjeNaam: string): Promise<number> {
  const res  = await fetch(`${API_URL}/api/3/contact/sync`, {
    method: 'POST', headers: hdrs,
    body: JSON.stringify({
      contact: {
        email,
        firstName: voornaam,
        fieldValues: [{ field: '1', value: stemmetjeNaam }],
      },
    }),
  });
  const data = await res.json();
  return Number(data.contact.id);
}

async function voegToeAanLijst(contactId: number): Promise<void> {
  await fetch(`${API_URL}/api/3/contactLists`, {
    method: 'POST', headers: hdrs,
    body: JSON.stringify({ contactList: { list: 11, contact: contactId, status: 1 } }),
  });
}

async function vindOfMaakTag(tagNaam: string): Promise<number> {
  const zoek = await fetch(`${API_URL}/api/3/tags?search=${encodeURIComponent(tagNaam)}`, { headers: hdrs });
  const data  = await zoek.json();
  const bestaand = (data.tags ?? []).find((t: { tag: string }) => t.tag === tagNaam);
  if (bestaand) return Number(bestaand.id);

  const maak = await fetch(`${API_URL}/api/3/tags`, {
    method: 'POST', headers: hdrs,
    body: JSON.stringify({ tag: { tag: tagNaam, tagType: 'contact' } }),
  });
  const nieuw = await maak.json();
  return Number(nieuw.tag.id);
}

async function voegTagToe(contactId: number, tagId: number): Promise<void> {
  await fetch(`${API_URL}/api/3/contactTags`, {
    method: 'POST', headers: hdrs,
    body: JSON.stringify({ contactTag: { contact: contactId, tag: tagId } }),
  });
}

export async function POST(req: Request) {
  const { voornaam, email, tag, naam } = await req.json();
  try {
    const contactId = await syncContact(voornaam, email, naam ?? '');
    await voegToeAanLijst(contactId);
    if (tag) {
      const tagId = await vindOfMaakTag(tag);
      await voegTagToe(contactId, tagId);
    }
  } catch (e) {
    console.error('MailBlue fout:', e);
  }
  return Response.json({ ok: true });
}
