export const CHALLENGES = [
  // ==================== WEB EXPLOITATION ====================
  {
    id: "web-1",
    category: "web",
    difficulty: "Easy",
    title: "The Forgotten Login",
    backstory:
      "A legacy internal admin panel for a small e-commerce site is still exposed on the dev network. The original developer left the company, and the login page uses a simple PHP script that builds a SQL query by string-concatenating user input. Your objective: bypass authentication and retrieve the flag stored on the server.",
    objective: "Bypass the login at http://dev-panel.ryzulab.local/login.php and obtain the flag from flag.php.",
    artifacts: [
      {
        type: "code",
        language: "php",
        label: "login.php source",
        content: `<?php\n$user = $_POST['username'] ?? '';\n$pass = $_POST['password'] ?? '';\n\n$query = "SELECT * FROM users WHERE username = '$user' AND password = '$pass'";\n$result = $db->query($query);\n\nif ($result->num_rows === 1) {\n    header("Location: /admin/flag.php");\n    exit;\n} else {\n    echo "Invalid credentials.";\n}\n?>`,
      },
      {
        type: "hint-text",
        label: "Exposed endpoint",
        content: "A `.git` directory was left exposed at http://dev-panel.ryzulab.local/.git/",
      },
    ],
    hint:
      "Think about what characters can break out of the single-quoted SQL string context in the `$query`. A classic `' OR '1'='1' -- ` payload makes the WHERE clause always true.",
    flag: "RYZU{SQLi_bypass_admin_panel}",
    points: 100,
    icon: "Globe",
  },
  {
    id: "web-2",
    category: "web",
    difficulty: "Medium",
    title: "Comment Stored XSS",
    backstory:
      "The blog engine at blog.ryzulab.local renders user comments server-side without escaping. A comment you post is displayed to every visitor, including the admin bot that visits new posts. Steal the admin's session cookie to access the admin panel.",
    objective: "Craft a stored XSS payload that exfiltrates document.cookie to your listener, then read the flag from the admin panel.",
    artifacts: [
      {
        type: "code",
        language: "html",
        label: "comment.php (excerpt)",
        content: `<div class="comment">\n  <?= $_POST['comment'] ?>\n</div>`,
      },
    ],
    hint:
      "Use an `<img src=x onerror=...>` or `<svg onload=...>` tag to run JavaScript when the comment is rendered, then send `document.cookie` to an attacker-controlled endpoint.",
    flag: "RYZU{XSS_stole_admin_cookie}",
    points: 300,
    icon: "Globe",
  },
  {
    id: "web-3",
    category: "web",
    difficulty: "Hard",
    title: "IDOR Ticket Escalation",
    backstory:
      "The support portal assigns each ticket a sequential ID. When you view your own ticket, the response includes a JSON body with your ticket details and an `access_level` field. Notice the URL pattern: `/api/ticket/<id>`. Try requesting an ID one above yours.",
    objective: "Access a ticket you do not own via an Insecure Direct Object Reference and extract the flag from the response.",
    artifacts: [
      {
        type: "code",
        language: "javascript",
        label: "Your ticket response (ticket/42)",
        content: `{\n  "id": 42,\n  "subject": "Password reset",\n  "status": "open",\n  "access_level": "user",\n  "note": "flag is in ticket #1001's internal notes"\n}`,
      },
      {
        type: "code",
        language: "bash",
        label: "Probe endpoint",
        content: `curl -H "Authorization: Bearer $SESSION" \\\n  https://support.ryzulab.local/api/ticket/42`,
      },
    ],
    hint:
      "There is no ownership check on the server-side endpoint. Increment the ticket ID in the URL until you find one whose `access_level` is `admin` and whose `internal_notes` contain the flag.",
    flag: "RYZU{IDOR_ticket_escalation}",
    points: 500,
    icon: "Globe",
  },

  // ==================== CRYPTOGRAPHY ====================
  {
    id: "crypto-1",
    category: "crypto",
    difficulty: "Easy",
    title: "Caesar Shift Cipher",
    backstory:
      "An intercepted message from an insider uses a simple substitution cipher. Each letter is shifted forward by a fixed number of positions in the alphabet. Frequency analysis reveals 'E' is the most common plaintext letter, but the ciphertext's most common letter is 'H'.",
    objective: "Recover the shift and decrypt the ciphertext to reveal the flag.",
    artifacts: [
      {
        type: "code",
        language: "text",
        label: "Ciphertext",
        content: "UHZ{RYZU{...}} decoded differently — actual: Vduu{flskhu_vhw_dvhfruh}",
      },
      {
        type: "code",
        language: "python",
        label: "Helper: try all 26 shifts",
        content: `ciphertext = "Vduu{flskhu_vhw_dvhfruh}"\nfor shift in range(26):\n    print(shift, "".join(\n        chr((ord(c) - 65 - shift) % 26 + 65) if c.isupper() else\n        chr((ord(c) - 97 - shift) % 26 + 97) if c.islower() else c\n        for c in ciphertext))`,
      },
    ],
    hint: "The most common ciphertext letter 'H' corresponds to plaintext 'E', so the shift is 3. Shift every letter backward by 3.",
    flag: "RYZU{caesar_cipher_solved}",
    points: 100,
    icon: "LockKeyhole",
  },
  {
    id: "crypto-2",
    category: "crypto",
    difficulty: "Medium",
    title: "Weak XOR Key Reuse",
    backstory:
      "A configuration file was encrypted with a repeating XOR key. You captured the ciphertext in hex and know the plaintext begins with the JSON prefix `{\"flag\":`. The key is short — only 4 bytes — and repeats across the message.",
    objective: "Recover the 4-byte XOR key from the known plaintext prefix, decrypt the full message, and extract the flag.",
    artifacts: [
      {
        type: "code",
        language: "text",
        label: "Ciphertext (hex)",
        content: "3a2c3b2a39282726494c4b4a49484746455a595857565b5a5958",
      },
      {
        type: "code",
        language: "python",
        label: "Known-plaintext XOR recovery",
        content: `ct = bytes.fromhex("3a2c3b2a39282726494c4b4a49484746455a595857565b5a5958")\nknown = b'{"flag":'\nkey = bytes(c ^ p for c, p in zip(ct, known))\nprint("key:", key)\nprint("decrypted:", bytes(c ^ key[i % len(key)] for i, c in enumerate(ct)))`,
      },
    ],
    hint:
      'XOR the first bytes of the ciphertext with the known plaintext prefix {"flag": to recover the repeating key, then decrypt the rest.',
    flag: "RYZU{XOR_key_reuse_broken}",
    points: 300,
    icon: "LockKeyhole",
  },
  {
    id: "crypto-3",
    category: "crypto",
    difficulty: "Hard",
    title: "RSA Small Private Exponent",
    backstory:
      "An RSA key pair was generated with a dangerously small private exponent `d`. The public modulus `n` and exponent `e` are published, and a ciphertext `c` was intercepted. Because `d` is small, Wiener's continued-fraction attack recovers the private key.",
    objective: "Recover `d` from `(n, e)` using Wiener's attack, decrypt `c`, and decode the flag.",
    artifacts: [
      {
        type: "code",
        language: "python",
        label: "Public parameters",
        content: `n = 997629327223591213227331181\n e = 65537\n c = 123456789012345678901234567\n\n# d is small enough for Wiener's continued-fraction attack`,
      },
    ],
    hint: "Use Wiener's attack: compute the continued fraction expansion of e/n and test each convergent as a candidate private exponent d.",
    flag: "RYZU{RSA_wiener_small_d}",
    points: 500,
    icon: "LockKeyhole",
  },

  // ==================== FORENSICS ====================
  {
    id: "forensics-1",
    category: "forensics",
    difficulty: "Easy",
    title: "EXIF Metadata Leak",
    backstory:
      "A photo was uploaded to a public forum by the suspect. The image still contains its original EXIF metadata, including GPS coordinates and the software used to edit it. One field hides the flag in plain sight.",
    objective: "Extract the EXIF metadata from the image and find the flag.",
    artifacts: [
      {
        type: "code",
        language: "text",
        label: "EXIF dump (exiftool)",
        content: `ExifTool Version Number         : 12.56\nFile Name                       : suspect_photo.jpg\nGPS Latitude                    : 37 deg 46' 38.40" N\nGPS Longitude                   : 122 deg 25' 6.00" W\nArtist                          : RYZU{exif_metadata_leak}\nSoftware                        : Adobe Photoshop 23.0`,
      },
    ],
    hint: "Run `exiftool suspect_photo.jpg` and scan every tag — the flag is stored in the `Artist` field.",
    flag: "RYZU{exif_metadata_leak}",
    points: 100,
    icon: "Bug",
  },
  {
    id: "forensics-2",
    category: "forensics",
    difficulty: "Medium",
    title: "PCAP Credential Sniff",
    backstory:
      "You captured a packet trace from a compromised host. Inside the PCAP is an unencrypted FTP session: the user logs in with a username and password in plaintext. Later, a file named `secret.txt` is transferred.",
    objective: "Follow the FTP control stream in the PCAP, recover the credentials, and read the flag from the transferred file contents visible in the data stream.",
    artifacts: [
      {
        type: "code",
        language: "text",
        label: "FTP control stream (Wireshark follow)",
        content: `220 Welcome to the ftp server.\nUSER ryuzu\n331 Password required for ryuzu\nPASS s3cr3tp@ssw0rd\n230 User logged in.\nRETR secret.txt\n150 Opening BINARY mode data connection.\n226 Transfer complete.\n\n[file contents]\nRYZU{pcap_ftp_sniff} \\n`,
      },
    ],
    hint:
      "Use Wireshark's 'Follow > TCP Stream' on the FTP control connection (port 21). The password and file contents are in plaintext.",
    flag: "RYZU{pcap_ftp_sniff}",
    points: 300,
    icon: "Bug",
  },
  {
    id: "forensics-3",
    category: "forensics",
    difficulty: "Hard",
    title: "PNG Steganography (LSB)",
    backstory:
      "An innocuous-looking PNG image was posted on a dark-web forum. The flag is hidden using least-significant-bit steganography in the red channel of the image pixels. A small Python script extracts it.",
    objective: "Extract the LSB-hidden payload from the PNG's red channel and decode the flag.",
    artifacts: [
      {
        type: "code",
        language: "python",
        label: "LSB extraction script",
        content: `from PIL import Image\nimport numpy as np\nimg = np.array(Image.open("leak.png").convert("RGB"))\nred = img[:, :, 0]\nlsbs = (red & 1).flatten()\nbits = "".join(str(b) for b in lsbs)\nchars = [chr(int(bits[i:i+8], 2)) for i in range(0, len(bits), 8)]\nprint("".join(chars).split("\\x00")[0])`,
      },
    ],
    hint:
      "Read the least significant bit of every red-channel pixel, group into 8-bit bytes, convert to characters, and stop at the first null byte.",
    flag: "RYZU{png_lsb_steganography}",
    points: 500,
    icon: "Bug",
  },

  // ==================== REVERSE ENGINEERING ====================
  {
    id: "reverse-1",
    category: "reverse",
    difficulty: "Easy",
    title: "License Key Checker",
    backstory:
      "A trial program checks a license key against a hardcoded value. The decompiled pseudo-C shows the comparison logic. Find the correct key to unlock the flag.",
    objective: "Analyze the pseudo-code and provide the license key that makes the check pass.",
    artifacts: [
      {
        type: "code",
        language: "c",
        label: "Decompiled check_license()",
        content: `int check_license(const char *key) {\n    if (strlen(key) != 12) return 0;\n    if (key[0] != 'R') return 0;\n    if (key[1] != 'Y') return 0;\n    if (key[2] != 'Z') return 0;\n    if (key[3] != 'U') return 0;\n    if (key[4] != '-') return 0;\n    if (key[5] != 'L') return 0;\n    if (key[6] != '3') return 0;\n    if (key[7] != 'T') return 0;\n    if (key[8] != 'H') return 0;\n    if (key[9] != '-') return 0;\n    if (key[10] != 'K') return 0;\n    if (key[11] != '3') return 0;\n    return 1;\n}`,
      },
    ],
    hint: "The pseudo-code compares each character of the input key position-by-position. Concatenate the expected characters to form the key.",
    flag: "RYZU{RE_license_key_RYZU-L3TH-K3}",
    points: 100,
    icon: "Microscope",
  },
  {
    id: "reverse-2",
    category: "reverse",
    difficulty: "Medium",
    title: "Custom Key-Check Algorithm",
    backstory:
      "A crackme validates a serial using a custom algorithm: each byte of the input is XORed with its index and compared to a table of expected bytes. Recover the input that produces the table.",
    objective: "Reverse the algorithm to find the serial that passes validation.",
    artifacts: [
      {
        type: "code",
        language: "c",
        label: "Decompiled validate_serial()",
        content: `int validate_serial(const char *s) {\n    unsigned char expected[] = {0x52, 0x58, 0x5b, 0x56, 0x2d, 0x44, 0x4b, 0x43};\n    for (int i = 0; i < 8; i++) {\n        if ((unsigned char)s[i] ^ i != expected[i]) return 0;\n    }\n    return 1;\n}`,
      },
    ],
    hint: "The check is `s[i] ^ i == expected[i]`, so `s[i] = expected[i] ^ i`. XOR each expected byte with its index to recover the serial.",
    flag: "RYZU{RE_xor_index_serial}",
    points: 300,
    icon: "Microscope",
  },
  {
    id: "reverse-3",
    category: "reverse",
    difficulty: "Hard",
    title: "VM Bytecode Crackme",
    backstory:
      "The binary contains a tiny custom virtual machine that executes a bytecode program guarding the flag. The bytecode is embedded in the `.rodata` section. Each opcode checks one character of the input against a constant.",
    objective: "Disassemble the VM bytecode and derive the input string that reaches the success branch.",
    artifacts: [
      {
        type: "code",
        language: "text",
        label: "VM bytecode (op, arg)",
        content: `0x01 0x52   // PUSH 'R'; compare input[0]\n0x01 0x59   // PUSH 'Y'; compare input[1]\n0x01 0x5a   // PUSH 'Z'; compare input[2]\n0x01 0x7b   // PUSH '{'; compare input[3]\n0x01 0x76   // PUSH 'v'; compare input[4]\n0x01 0x6d   // PUSH 'm'; compare input[5]\n0x01 0x30   // PUSH '0'; compare input[6]\n0x01 0x7d   // PUSH '}'; compare input[7]\n0x02        // HALT / success if all matched`,
      },
    ],
    hint: "Each `0x01 arg` opcode compares `input[pc]` to `arg`. Collect the args in order to form the flag.",
    flag: "RYZU{vm0}",
    points: 500,
    icon: "Microscope",
  },

  // ==================== BINARY EXPLOITATION / PWN ====================
  {
    id: "pwn-1",
    category: "pwn",
    difficulty: "Easy",
    title: "Stack Buffer Overflow (gets)",
    backstory:
      "A small C program reads user input with `gets()` into a 64-byte buffer, then calls `print_flag()` if a global `auth` variable is non-zero. Overflow the buffer to overwrite `auth` and trigger the flag print.",
    objective: "Send an input longer than 64 bytes to overwrite the `auth` variable and invoke `print_flag()`.",
    artifacts: [
      {
        type: "code",
        language: "c",
        label: "vuln.c",
        content: `#include <stdio.h>\nint auth = 0;\nvoid print_flag() { puts("RYZU{stack_bof_gets}"); }\nint main() {\n    char buf[64];\n    gets(buf);\n    if (auth) print_flag();\n    else puts("Access denied.");\n    return 0;\n}`,
      },
      {
        type: "code",
        language: "text",
        label: "Memory layout",
        content: `buf[0..63]   <- 64 bytes\nsaved rbp    <- 8 bytes (x86_64)\nreturn addr  <- 8 bytes\nauth global  <- in .bss, set to non-zero to win`,
      },
    ],
    hint:
      "Fill the 64-byte buffer plus 8 bytes of saved RBP (8 total padding after buf on x86_64) to reach and overwrite `auth` with any non-zero value.",
    flag: "RYZU{stack_bof_gets}",
    points: 100,
    icon: "Zap",
  },
  {
    id: "pwn-2",
    category: "pwn",
    difficulty: "Medium",
    title: "Format String Leak",
    backstory:
      'A note-taking binary prints user-supplied input directly with printf(input) instead of printf("%s", input). Leak the stack canary and a libc address to defeat ASLR, then call system("/bin/sh").',
    objective: "Use format-string reads to leak the canary and libc base, then build a ROP chain to spawn a shell and read the flag.",
    artifacts: [
      {
        type: "code",
        language: "c",
        label: "vuln.c (excerpt)",
        content: `void read_note() {\n    char input[256];\n    read(0, input, 256);\n    printf(input);   // BUG: no format string\n    fflush(stdout);\n}`,
      },
    ],
    hint:
      "Pass `%p.%p.%p...` as input to read stack values. Find the canary and a libc address, compute libc base, then ROP to `system(\"/bin/sh\")`.",
    flag: "RYZU{fmt_string_leak_libc}",
    points: 300,
    icon: "Zap",
  },
  {
    id: "pwn-3",
    category: "pwn",
    difficulty: "Hard",
    title: "Return-to-libc (ret2libc)",
    backstory:
      "A stack buffer overflow lets you control the return address, but the stack is non-executable (no shellcode). `system()` exists in the PLT and `/bin/sh` string exists in libc. Build a ret2libc chain.",
    objective: "Overflow the return address to call `system(\"/bin/sh\")` and read `flag.txt`.",
    artifacts: [
      {
        type: "code",
        language: "c",
        label: "vuln.c",
        content: `#include <stdio.h>\n#include <string.h>\nvoid win() { system("/bin/sh"); }\nint main() {\n    char buf[32];\n    gets(buf);\n    return 0;\n}`,
      },
      {
        type: "code",
        language: "text",
        label: "Offsets",
        content: `buffer: 32 bytes\nsaved rbp: 8 bytes\nreturn address: offset 40\nsystem PLT: 0x401050\n/bin/sh in libc: leak needed at runtime`,
      },
    ],
    hint:
      "Pad to offset 40, overwrite RIP with the address of `system`, and place a pointer to the `/bin/sh` string as the argument. Use a `ret` gadget for stack alignment if needed.",
    flag: "RYZU{ret2libc_system_binsh}",
    points: 500,
    icon: "Zap",
  },

  // ==================== OSINT ====================
  {
    id: "osint-1",
    category: "osint",
    difficulty: "Easy",
    title: "Domain WHOIS Lookup",
    backstory:
      "A suspicious domain was registered by the threat actor. Public WHOIS records reveal the registrant name, email, and organization. One of these fields contains the flag.",
    objective: "Query the WHOIS record for `ryzulab-target.example` and extract the flag from the registrant field.",
    artifacts: [
      {
        type: "code",
        language: "bash",
        label: "whois output",
        content: `Domain Name: RYZULAB-TARGET.EXAMPLE\nRegistry Domain ID: 1234567890\nRegistrant Name: RYZU{osint_whois_lookup}\nRegistrant Email: admin@ryzulab-target.example\nRegistrant Organization: RyzuLab Security`,
      },
    ],
    hint: "Run `whois ryzulab-target.example` and look at the Registrant Name field — the flag is embedded there.",
    flag: "RYZU{osint_whois_lookup}",
    points: 100,
    icon: "Search",
  },
  {
    id: "osint-2",
    category: "osint",
    difficulty: "Medium",
    title: "DNS Enumeration & Subdomain",
    backstory:
      "The target organization has a public DNS zone. Brute-forcing common subdomain names reveals a hidden admin subdomain whose TXT record contains the flag.",
    objective: "Enumerate subdomains of `corp.ryzulab.example`, find the admin subdomain, and read its TXT record.",
    artifacts: [
      {
        type: "code",
        language: "bash",
        label: "dig +short TXT admin",
        content: `admin.corp.ryzulab.example.	3600	IN	TXT	"RYZU{osint_dns_enum}"`,
      },
    ],
    hint: "Use `dig` or `subbrute` to probe common subdomain names, then query any discoveries for TXT records.",
    flag: "RYZU{osint_dns_enum}",
    points: 300,
    icon: "Search",
  },
  {
    id: "osint-3",
    category: "osint",
    difficulty: "Hard",
    title: "Photo Geolocation",
    backstory:
      "A photo posted by the actor shows a distinctive landmark and a street sign in the background. Using the landmark, street sign, and shadow direction, determine the city and extract the flag embedded in the location name.",
    objective: "Geolocate the photo and report the flag derived from the identified location.",
    artifacts: [
      {
        type: "code",
        language: "text",
        label: "Photo clues",
        content: "Landmark: clock tower with four faces\nStreet sign: 'Main St & 5th Ave'\nShadow: cast to the northwest at noon\nCity seal visible on a nearby building",
      },
    ],
    hint: "Match the four-faced clock tower and street intersection to a real-world city; the flag is derived from that city's name.",
    flag: "RYZU{osint_geolocation_city}",
    points: 500,
    icon: "Search",
  },

  // ==================== MISC ====================
  {
    id: "misc-1",
    category: "misc",
    difficulty: "Easy",
    title: "Base64 Chain Decode",
    backstory:
      "The flag was encoded repeatedly through a chain of encodings. Each layer is base64. Decode until you reach plaintext.",
    objective: "Repeatedly base64-decode the string until the flag appears in plaintext.",
    artifacts: [
      {
        type: "code",
        language: "text",
        label: "Encoded string (layer 1)",
        content: "UllaWnt7bXlzcGFjZXxlbmNvZGVkfX0=",
      },
    ],
    hint: "Decode the string with `base64 -d` repeatedly. Each output becomes the input for the next decode until readable plaintext emerges.",
    flag: "RYZU{misc_base64_chain}",
    points: 100,
    icon: "Hammer",
  },
  {
    id: "misc-2",
    category: "misc",
    difficulty: "Medium",
    title: "Python Sandbox Escape",
    backstory:
      "A restricted Python evaluator blocks `__import__`, `open`, `eval`, `exec`, and attribute access via `__`. You need to read `/flag.txt` without using the blocked builtins.",
    objective: "Craft a one-liner that reads `/flag.txt` using only allowed Python constructs.",
    artifacts: [
      {
        type: "code",
        language: "python",
        label: "Blocked: __import__, open, eval, exec, __ attribute access",
        content: `# Allowed: builtins except dunder/import/open/eval/exec\n# Hint: use generators, getattr, and the `+` trick on exceptions`,
      },
    ],
    hint:
      "Access `builtins` through an exception's `__traceback__` or a generator's `gi_frame`, then reach `open` without writing the literal `__import__` string.",
    flag: "RYZU{misc_sandbox_escape}",
    points: 300,
    icon: "Hammer",
  },
  {
    id: "misc-3",
    category: "misc",
    difficulty: "Hard",
    title: "Esoteric Language (Brainfuck)",
    backstory:
      "The flag was encoded in Brainfuck, an esoteric language with only 8 commands. Translate the program output to recover the flag.",
    objective: "Interpret the Brainfuck program and read the output string, which is the flag.",
    artifacts: [
      {
        type: "code",
        language: "text",
        label: "Brainfuck program",
        content: `++++++++[>++++[>++>+++>+++>+<<<<-]>+>+>->>+[<]<-]>>.>---.+++++++..+++.>>.<-.<.+++.------.--------.>>+.>++++.`,
      },
    ],
    hint: "Run the Brainfuck program through any interpreter; the printed characters spell out the flag.",
    flag: "RYZU{misc_brainfuck}",
    points: 500,
    icon: "Hammer",
  },
];

export function getChallengesByCategory(categoryId) {
  return CHALLENGES.filter((c) => c.category === categoryId);
}

export function getChallengeById(id) {
  return CHALLENGES.find((c) => c.id === id);
}

export function getChallengesByDifficulty(difficulty) {
  return CHALLENGES.filter((c) => c.difficulty === difficulty);
}

export function getPointsForDifficulty(difficulty) {
  return DIFFICULTY_POINTS[difficulty] || 0;
}
