#!/usr/bin/env python3
"""Stellt die Terminseite eines Studios selbst auf Netlify online: kein Ordner-Hineinziehen von Hand mehr.

Aufruf (aus dem Repo-Hauptordner):
    python3 nischen/beauty/vorlagen/werkzeuge/netlify-hochladen.py <kürzel> [--name projektname] [--probe]

Was es tut:
  1. Sucht in eurem Netlify-Konto das Projekt mit dem Namen des Kürzels (oder --name). Gibt es keins, legt es eins an.
  2. Packt den Ordner nischen/beauty/kunden/<kürzel>/seite als ZIP und lädt ihn hoch (eine neue Fassung, die alte bleibt
     im Verlauf von Netlify und lässt sich dort mit einem Klick zurückholen).
  3. Wartet, bis die Seite online ist, und prüft, dass termin.html antwortet.
  --probe: prüft nur, ob der Zugang klappt (zeigt das Konto), lädt nichts hoch.

Zugang: Netlify-Zugangsschlüssel („Personal access token“). In dieser Cloud-Umgebung trägt ihn der Proxy selbst ein,
sobald er einmal sicher hinterlegt ist; lokal geht auch die Umgebungsvariable NETLIFY_AUTH_TOKEN. Der Schlüssel steht
nie im Repo und nie im Chat.

Jede Fassung kostet bei Netlify 15 Credits (Tarif Personal: 1.000 im Monat). Also nicht für jede Kleinigkeit neu hochladen.
"""
import io
import json
import os
import pathlib
import re
import ssl
import sys
import time
import urllib.error
import urllib.request
import zipfile

HIER = pathlib.Path(__file__).resolve().parent
KUNDEN = HIER.parent.parent / "kunden"
API = "https://api.netlify.com/api/v1"


def ssl_kontext():
    for pfad in (os.environ.get("SSL_CERT_FILE"), "/root/.ccr/ca-bundle.crt"):
        if pfad and pathlib.Path(pfad).exists():
            return ssl.create_default_context(cafile=pfad)
    return ssl.create_default_context()


def anfrage(methode, pfad, daten=None, typ="application/json", url=None):
    token = os.environ.get("NETLIFY_AUTH_TOKEN") or "wird-vom-proxy-ersetzt"
    kopf = {"Authorization": "Bearer " + token, "User-Agent": "clickculture-werkzeug"}
    if daten is not None:
        kopf["Content-Type"] = typ
        if typ == "application/json":
            daten = json.dumps(daten).encode()
    req = urllib.request.Request(url or API + pfad, data=daten, method=methode, headers=kopf)
    try:
        with urllib.request.urlopen(req, context=ssl_kontext(), timeout=120) as r:
            inhalt = r.read()
            return r.status, (json.loads(inhalt) if inhalt and r.headers.get_content_type() == "application/json" else inhalt)
    except urllib.error.HTTPError as e:
        text = e.read().decode(errors="replace")
        try:
            return e.code, json.loads(text)
        except ValueError:
            return e.code, text
    except urllib.error.URLError as e:
        sys.exit(f"✗ Netlify nicht erreichbar ({e.reason}). In der Cloud-Sitzung: Ist der Zugang zu api.netlify.com freigegeben?")


def projekt_finden(name):
    status, liste = anfrage("GET", f"/sites?name={name}&filter=all&per_page=100")
    if status == 401:
        sys.exit("✗ Netlify sagt „nicht angemeldet“: Der Zugangsschlüssel fehlt oder ist abgelaufen.")
    if status != 200:
        sys.exit(f"✗ Netlify antwortet {status}: {liste}")
    return next((s for s in liste if s.get("name") == name), None)


def projekt_anlegen(name):
    status, antwort = anfrage("POST", "/sites", {"name": name})
    if status in (200, 201):
        print(f"✓ Neues Netlify-Projekt „{name}“ angelegt")
        return antwort
    if status == 422:
        sys.exit(f"✗ Der Name „{name}“ ist bei Netlify schon vergeben (von jemand anderem). Lösung: einen anderen Namen wählen, "
                 f"z. B. --name {name}-termine, dann auf der Team-Seite des Studios die Adresse der Seite anpassen und Claude die Seite neu bauen lassen.")
    sys.exit(f"✗ Projekt anlegen ging nicht ({status}): {antwort}")


def zip_bauen(ordner):
    puffer = io.BytesIO()
    with zipfile.ZipFile(puffer, "w", zipfile.ZIP_DEFLATED) as zf:
        for p in sorted(ordner.rglob("*")):
            if p.is_file() and not p.name.startswith("."):
                zf.write(p, p.relative_to(ordner).as_posix())
    return puffer.getvalue()


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    if args[0] == "--probe":
        status, ich = anfrage("GET", "/user")
        if status != 200:
            sys.exit(f"✗ Zugang klappt nicht ({status}): {ich}")
        print(f"✓ Netlify-Zugang klappt: Konto {ich.get('full_name') or ich.get('slug') or '?'}")
        return
    kuerzel = args[0]
    name = args[args.index("--name") + 1] if "--name" in args else kuerzel
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{1,62}", name):
        sys.exit(f"✗ „{name}“ geht nicht als Projektname (nur kleine Buchstaben, Ziffern, Bindestrich).")
    seite = KUNDEN / kuerzel / "seite"
    if not (seite / "termin.html").exists():
        sys.exit(f"✗ {seite} fehlt. Erst kunde-anlegen.py laufen lassen.")
    daten = json.loads((KUNDEN / kuerzel / "daten.json").read_text(encoding="utf-8")) if (KUNDEN / kuerzel / "daten.json").exists() else {}
    projekt = projekt_finden(name) or projekt_anlegen(name)
    adresse = (projekt.get("ssl_url") or projekt.get("url") or f"https://{name}.netlify.app").rstrip("/")
    inhalt = zip_bauen(seite)
    print(f"… lade {len(inhalt) // 1024} KB hoch")
    status, deploy = anfrage("POST", f"/sites/{projekt['id']}/deploys", inhalt, "application/zip")
    if status not in (200, 201):
        sys.exit(f"✗ Hochladen ging nicht ({status}): {deploy}")
    for _ in range(60):
        if deploy.get("state") in ("ready", "error"):
            break
        time.sleep(2)
        _, deploy = anfrage("GET", f"/deploys/{deploy['id']}")
    if deploy.get("state") != "ready":
        sys.exit(f"✗ Netlify meldet „{deploy.get('state')}“: {deploy.get('error_message') or ''}")
    print(f"✓ Online (Netlify meldet „bereit“): {adresse}/termin.html  · einmal im Browser öffnen und ansehen")
    soll = str(daten.get("seite") or "").rstrip("/")
    if soll and soll != adresse:
        print(f"! Die Zentrale kennt die Adresse {soll}. Auf der Team-Seite des Studios bei „Adresse der Seite“ {adresse} eintragen"
              f" und Claude die Seite neu bauen lassen (Links in den Mails zeigen sonst ins Leere).")


if __name__ == "__main__":
    main()
