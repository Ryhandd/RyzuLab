#!/usr/bin/env python3
"""
RyzuLab reverse-1 -- License Key Checker

This is the readable (de-obfuscated) form of the compiled key-checker binary
distributed with the trial program. The compiled version performs the exact
same character-by-character comparison show below; it was just harder to
read as raw assembly. Run it and supply the key you believe is correct.
"""

EXPECTED = ['R', 'Y', 'Z', 'U', '-', 'L', '3', 'T', 'H', '-', 'K', '3']


def check_license(key: str) -> bool:
    if len(key) != len(EXPECTED):
        return False
    for i, ch in enumerate(EXPECTED):
        if key[i] != ch:
            return False
    return True


def main():
    key = input("Enter license key: ").strip()
    if check_license(key):
        print(f"Valid license. Flag: RYZU{{RE_license_key_{key}}}")
    else:
        print("Invalid license key.")


if __name__ == "__main__":
    main()
