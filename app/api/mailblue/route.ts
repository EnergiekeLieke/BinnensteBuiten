export async function POST(req: Request) {
  const { voornaam, email } = await req.json();

  const params = new URLSearchParams({
    u: '5',
    f: '5',
    s: '',
    c: '0',
    m: '0',
    act: 'sub',
    v: '2',
    or: '6dbe16bc-c973-4234-b90b-3b73ef2b6f1f',
    firstname: voornaam,
    email: email,
    'nlbox[]': '11',
    jsonp: 'true',
  });

  try {
    await fetch(`https://energiekelieke.activehosted.com/proc.php?${params.toString()}`);
  } catch {
    // Stille fout: lead toch tonen ook als MailBlue tijdelijk niet bereikbaar is
  }

  return Response.json({ ok: true });
}
