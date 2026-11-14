// Lab definitions: each challenge can point at a real, openable target and/or a
// real downloadable file. `kind` values:
//   "web"     – a static vulnerable web app served from /labs/<id>/
//   "file"    – one or more real binary/tool files under /files/
//   "inline"  – no external target; work happens with the artifact data provided
export const LABS = {
  // ---------------- WEB ----------------
  "web-1": {
    kind: "web",
    url: "/labs/web-1/index.html",
    label: "Open the dev-panel login",
    intro:
      "This is a live copy of the vulnerable login. The SQL query is built the same way the real one was — try to bypass it.",
    steps: [
      "Open the lab and look at how the form talks to the backend.",
      "Send a payload that makes the WHERE clause always true.",
      "Once you are in, the admin page reveals the flag.",
    ],
  },
  "web-2": {
    kind: "web",
    url: "/labs/web-2/index.html",
    label: "Open the comment board",
    intro:
      "A working guestbook that renders whatever you post. A simulated admin bot visits every new comment.",
    steps: [
      "Post a comment and watch how it is rendered.",
      "Find an injection that executes JavaScript.",
      "The bot's cookie is captured on the admin view.",
    ],
  },
  "web-3": {
    kind: "web",
    url: "/labs/web-3/index.html",
    label: "Open the support portal",
    intro:
      "A support ticket portal with a real JSON API. Your session is ticket 42; other tickets exist on the same endpoint.",
    steps: [
      "Read your own ticket through the API.",
      "Change the ID in the request — no ownership check exists.",
      "Find the admin ticket with the flag in internal_notes.",
    ],
  },

  // ---------------- CRYPTO ----------------
  "crypto-1": { kind: "inline" },
  "crypto-2": { kind: "inline" },
  "crypto-3": {
    kind: "file",
    files: [
      {
        name: "rsa_challenge.txt",
        href: "/files/crypto-3/rsa_challenge.txt",
        desc: "The public key parameters and the ciphertext.",
      },
    ],
    intro: "Download the challenge file and factor the weak modulus.",
  },

  // ---------------- FORENSICS ----------------
  "forensics-1": {
    kind: "file",
    files: [
      {
        name: "suspect_photo.jpg",
        href: "/files/forensics-1/suspect_photo.jpg",
        desc: "Photo posted to the forum. Check its EXIF metadata.",
      },
    ],
    intro:
      "Download the photo and read its EXIF metadata with exiftool, or an online viewer. The flag is in a comment field.",
  },
  "forensics-2": {
    kind: "file",
    files: [
      {
        name: "capture.pcap",
        href: "/files/forensics-2/capture.pcap",
        desc: "Packet capture with an unencrypted FTP login.",
      },
    ],
    intro:
      "Open the capture in Wireshark or tshark and follow the FTP control stream.",
  },
  "forensics-3": {
    kind: "file",
    files: [
      {
        name: "stego.png",
        href: "/files/forensics-3/stego.png",
        desc: "PNG with data hidden in the least-significant bits.",
      },
    ],
    intro:
      "Extract the LSB data. zsteg, or a short Python script using PIL, will recover it.",
  },

  // ---------------- REVERSE ----------------
  "reverse-1": {
    kind: "file",
    files: [
      {
        name: "checker.py",
        href: "/files/reverse-1/checker.py",
        desc: "The compiled-looking key checker, in readable form.",
      },
    ],
    intro: "Read the checker and work out the accepted input.",
  },
  "reverse-2": {
    kind: "file",
    files: [
      {
        name: "license_check.txt",
        href: "/files/reverse-2/license_check.txt",
        desc: "Disassembly-style pseudo-code of the license routine.",
      },
    ],
    intro: "Trace the routine and recover the key it expects.",
  },
  "reverse-3": {
    kind: "file",
    files: [
      {
        name: "Guest.apk.b64",
        href: "/files/reverse-3/Guest.apk.b64",
        desc: "Base64 of a small APK. Decode to Guest.apk, then unzip it.",
      },
    ],
    intro:
      "Decode the base64, unzip the APK, and read classes.dex / resources for the embedded secret.",
  },

  // ---------------- PWN ----------------
  "pwn-1": {
    kind: "file",
    files: [
      {
        name: "vuln.c",
        href: "/files/pwn-1/vuln.c",
        desc: "The vulnerable source with the winning address in a comment.",
      },
    ],
    intro: "Read the source, then work out the payload that reaches win().",
  },
  "pwn-2": {
    kind: "inline",
  },
  "pwn-3": {
    kind: "inline",
  },

  // ---------------- OSINT ----------------
  "osint-1": {
    kind: "inline",
  },
  "osint-2": {
    kind: "inline",
  },
  "osint-3": {
    kind: "inline",
  },

  // ---------------- MISC ----------------
  "misc-1": { kind: "inline" },
  "misc-2": { kind: "inline" },
  "misc-3": { kind: "inline" },
};

export function getLab(challengeId) {
  return LABS[challengeId] || { kind: "inline" };
}
