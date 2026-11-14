// RyzuLab pwn-1 -- Stack Buffer Overflow (gets)
// Build (for local testing only, matches the remote service exactly):
//   gcc -no-pie -fno-stack-protector -o vuln vuln.c
//
// `auth` sits right after `buf` on the stack/.bss layout the remote binary
// was compiled with. gets() performs no bounds checking, so any input past
// 64 bytes keeps writing into the bytes that follow `buf` -- including the
// padding and, eventually, `auth`.
//
// Winning address (for reference, if you disassemble instead of reasoning
// about layout): print_flag() is at 0x4011d6 in the distributed binary.

#include <stdio.h>

int auth = 0;

void print_flag() {
    puts("RYZU{stack_bof_gets}");
}

int main() {
    char buf[64];
    puts("Enter access token:");
    gets(buf);                 // <-- the bug: no length check
    if (auth) {
        print_flag();
    } else {
        puts("Access denied.");
    }
    return 0;
}

// Hint on the payload:
//   64 bytes to fill buf completely, then a few more bytes to spill into the
//   padding/`auth` global that follows it in memory. Any non-zero value
//   written into `auth` flips the check above.
//
//   python3 -c "print('A'*64 + 'B'*8)" | ./vuln
