/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/stave.json`.
 */
export type Stave = {
  "address": "EcJDYr1y6DTwjyGj6q2fskfyWv2733JZjffaW31bKR3Q",
  "metadata": {
    "name": "stave",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Stave on-chain program"
  },
  "instructions": [
    {
      "name": "createWork",
      "docs": [
        "Create a new IP work: Token-2022 share mint + IpWork PDA + initial supply."
      ],
      "discriminator": [
        169,
        196,
        137,
        21,
        147,
        200,
        52,
        85
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "ipWork",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  111,
                  114,
                  107
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "workId"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "writable": true,
          "signer": true
        },
        {
          "name": "creatorShareAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "shareMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "workId",
          "type": "u64"
        },
        {
          "name": "metadataUri",
          "type": "string"
        },
        {
          "name": "totalShares",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "ipWork",
      "discriminator": [
        220,
        170,
        139,
        148,
        239,
        155,
        42,
        190
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "metadataUriTooLong",
      "msg": "Metadata URI exceeds 200 characters"
    },
    {
      "code": 6001,
      "name": "invalidTotalShares",
      "msg": "Total shares must be greater than zero"
    },
    {
      "code": 6002,
      "name": "mathOverflow",
      "msg": "Math overflow"
    }
  ],
  "types": [
    {
      "name": "ipWork",
      "docs": [
        "On-chain record of a fractionalized IP work.",
        "",
        "PDA seeds: `[b\"work\", creator, work_id.to_le_bytes()]`"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "docs": [
              "The wallet that created this work. Also the initial share holder."
            ],
            "type": "pubkey"
          },
          {
            "name": "workId",
            "docs": [
              "Monotonic per-creator id, supplied by the creator at creation time.",
              "Allows multiple works per creator without Keypair juggling."
            ],
            "type": "u64"
          },
          {
            "name": "metadataUri",
            "docs": [
              "Off-chain metadata URI (Irys / Arweave). Points to title, cover art,",
              "audio preview, artist info, ISRC, etc."
            ],
            "type": "string"
          },
          {
            "name": "coreNft",
            "docs": [
              "Address of the Metaplex Core NFT representing this work.",
              "Zeroed on Day 1-2; populated by the NFT-mint instruction (follow-up)."
            ],
            "type": "pubkey"
          },
          {
            "name": "shareMint",
            "docs": [
              "Token-2022 fungible mint representing fractional royalty shares."
            ],
            "type": "pubkey"
          },
          {
            "name": "totalShares",
            "docs": [
              "Total supply of shares minted at creation. Immutable."
            ],
            "type": "u64"
          },
          {
            "name": "createdAt",
            "docs": [
              "Unix timestamp (seconds) of creation, for display and audit."
            ],
            "type": "i64"
          },
          {
            "name": "bump",
            "docs": [
              "PDA bump."
            ],
            "type": "u8"
          }
        ]
      }
    }
  ]
};
