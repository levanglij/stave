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
      "name": "buyShares",
      "docs": [
        "Buy `amount` shares from a listing. Buyer pays creator in",
        "`payment_mint`; vault releases shares to buyer; listing's",
        "`shares_available` decremented."
      ],
      "discriminator": [
        40,
        239,
        138,
        154,
        8,
        37,
        106,
        108
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "creator",
          "docs": [
            "The work's creator - payment recipient. Verified by IpWork's",
            "has_one constraint below.",
            "validated by `has_one = creator` on ip_work."
          ],
          "relations": [
            "ipWork"
          ]
        },
        {
          "name": "ipWork"
        },
        {
          "name": "listing",
          "docs": [
            "Listing PDA - verified via [b\"listing\", ip_work] seeds.",
            "has_one ensures the passed payment_mint and vault match."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "ipWork"
              }
            ]
          }
        },
        {
          "name": "shareMint",
          "relations": [
            "ipWork"
          ]
        },
        {
          "name": "vault",
          "docs": [
            "Listing vault holding shares for sale; authority = listing PDA."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "listing"
              },
              {
                "kind": "account",
                "path": "shareTokenProgram"
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
          },
          "relations": [
            "listing"
          ]
        },
        {
          "name": "buyerShareAta",
          "docs": [
            "Buyer's share ATA. Created on first buy."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "account",
                "path": "shareTokenProgram"
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
          "name": "paymentMint",
          "relations": [
            "listing"
          ]
        },
        {
          "name": "buyerPaymentAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "account",
                "path": "paymentTokenProgram"
              },
              {
                "kind": "account",
                "path": "paymentMint"
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
          "name": "creatorPaymentAta",
          "docs": [
            "Creator's payment ATA. Created on first buy if absent; buyer",
            "pays the rent (cost of business for taking the listing)."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "account",
                "path": "paymentTokenProgram"
              },
              {
                "kind": "account",
                "path": "paymentMint"
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
          "name": "shareTokenProgram",
          "docs": [
            "Share token program (Token-2022 for fractional shares)."
          ]
        },
        {
          "name": "paymentTokenProgram",
          "docs": [
            "Payment token program (classic SPL Token for devnet USDC)."
          ]
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
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimRoyalty",
      "docs": [
        "Claim accumulated royalties pro-rata based on the holder's",
        "current share balance and new deposits since the holder's",
        "previous claim."
      ],
      "discriminator": [
        10,
        75,
        29,
        207,
        114,
        170,
        28,
        108
      ],
      "accounts": [
        {
          "name": "holder",
          "writable": true,
          "signer": true
        },
        {
          "name": "ipWork"
        },
        {
          "name": "shareMint",
          "docs": [
            "Used to validate `holder_share_ata`'s mint."
          ]
        },
        {
          "name": "holderShareAta",
          "docs": [
            "Holder's share ATA. Balance at claim time determines the share."
          ],
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "holder"
              },
              {
                "kind": "account",
                "path": "shareTokenProgram"
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
          "name": "royaltyVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  121,
                  97,
                  108,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "ipWork"
              }
            ]
          }
        },
        {
          "name": "paymentMint",
          "relations": [
            "royaltyVault"
          ]
        },
        {
          "name": "royaltyTokenVault",
          "docs": [
            "Token vault holding the deposited royalties. Authority = vault PDA."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "royaltyVault"
              },
              {
                "kind": "account",
                "path": "paymentTokenProgram"
              },
              {
                "kind": "account",
                "path": "paymentMint"
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
          "name": "holderPaymentAta",
          "docs": [
            "Holder's payment ATA - credited. Created on first claim."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "holder"
              },
              {
                "kind": "account",
                "path": "paymentTokenProgram"
              },
              {
                "kind": "account",
                "path": "paymentMint"
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
          "name": "claimRecord",
          "docs": [
            "Per-holder claim ledger. Init on first claim."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "ipWork"
              },
              {
                "kind": "account",
                "path": "holder"
              }
            ]
          }
        },
        {
          "name": "shareTokenProgram"
        },
        {
          "name": "paymentTokenProgram"
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
      "args": []
    },
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
    },
    {
      "name": "depositRoyalty",
      "docs": [
        "Deposit `amount` of `payment_mint` into the work's royalty vault.",
        "Anyone can deposit. Vault initialized lazily on first call."
      ],
      "discriminator": [
        234,
        6,
        85,
        217,
        36,
        30,
        33,
        127
      ],
      "accounts": [
        {
          "name": "depositor",
          "writable": true,
          "signer": true
        },
        {
          "name": "ipWork",
          "docs": [
            "The work receiving the royalty. Read-only."
          ]
        },
        {
          "name": "royaltyVault",
          "docs": [
            "Royalty vault PDA. Initialized on first deposit."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  111,
                  121,
                  97,
                  108,
                  116,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "ipWork"
              }
            ]
          }
        },
        {
          "name": "paymentMint"
        },
        {
          "name": "royaltyTokenVault",
          "docs": [
            "Token account holding the deposited royalties. Authority is",
            "the royalty_vault PDA. Created on first deposit."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "royaltyVault"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "paymentMint"
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
          "name": "depositorPaymentAta",
          "docs": [
            "Depositor's payment ATA - debited."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "depositor"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "paymentMint"
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
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "listShares",
      "docs": [
        "List a portion of the creator's shares for sale at a fixed price.",
        "Locks the listed shares into a Listing-PDA-authority vault."
      ],
      "discriminator": [
        156,
        51,
        24,
        84,
        242,
        112,
        152,
        53
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true,
          "relations": [
            "ipWork"
          ]
        },
        {
          "name": "ipWork",
          "docs": [
            "The IpWork being listed. Verifies `creator` matches the recorded",
            "creator and `share_mint` matches the recorded share mint."
          ]
        },
        {
          "name": "shareMint",
          "relations": [
            "ipWork"
          ]
        },
        {
          "name": "creatorShareAta",
          "docs": [
            "Creator's existing share ATA - debited by `shares_to_list`."
          ],
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
          "name": "listing",
          "docs": [
            "New Listing PDA. One listing per work."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  115,
                  116,
                  105,
                  110,
                  103
                ]
              },
              {
                "kind": "account",
                "path": "ipWork"
              }
            ]
          }
        },
        {
          "name": "listingVault",
          "docs": [
            "Vault token account holding the listed shares. Authority = listing PDA."
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "listing"
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
          "name": "paymentMint",
          "docs": [
            "Mint of the token buyers will pay with (USDC devnet at launch)."
          ]
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
          "name": "pricePerShare",
          "type": "u64"
        },
        {
          "name": "sharesToList",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "claimRecord",
      "discriminator": [
        57,
        229,
        0,
        9,
        65,
        62,
        96,
        7
      ]
    },
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
    },
    {
      "name": "listing",
      "discriminator": [
        218,
        32,
        50,
        73,
        43,
        134,
        26,
        58
      ]
    },
    {
      "name": "royaltyVault",
      "discriminator": [
        199,
        161,
        41,
        234,
        112,
        113,
        58,
        98
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
    },
    {
      "code": 6003,
      "name": "invalidPrice",
      "msg": "Price per share must be greater than zero"
    },
    {
      "code": 6004,
      "name": "invalidShareCount",
      "msg": "Number of shares to list must be greater than zero"
    },
    {
      "code": 6005,
      "name": "insufficientShares",
      "msg": "Creator does not have enough shares to list"
    },
    {
      "code": 6006,
      "name": "notWorkCreator",
      "msg": "Caller is not the creator of this IpWork"
    },
    {
      "code": 6007,
      "name": "shareMintMismatch",
      "msg": "Provided share mint does not match the IpWork's share mint"
    },
    {
      "code": 6008,
      "name": "insufficientListing",
      "msg": "Listing does not have enough shares available for this purchase"
    },
    {
      "code": 6009,
      "name": "paymentMintMismatch",
      "msg": "Provided payment mint does not match the listing's payment mint"
    },
    {
      "code": 6010,
      "name": "vaultMismatch",
      "msg": "Provided vault does not match the listing's vault"
    },
    {
      "code": 6011,
      "name": "invalidAmount",
      "msg": "Amount must be greater than zero"
    },
    {
      "code": 6012,
      "name": "noSharesHeld",
      "msg": "Holder does not own any shares of this work"
    },
    {
      "code": 6013,
      "name": "nothingToClaim",
      "msg": "No royalties available to claim at this time"
    }
  ],
  "types": [
    {
      "name": "claimRecord",
      "docs": [
        "Per-holder claim ledger for one work's royalties.",
        "",
        "Records the holder, their cumulative claimed amount, and a",
        "\"checkpoint\" of the vault's `total_deposited` at their last",
        "claim. New claimable amount on the next claim is computed against",
        "new deposits since the checkpoint.",
        "",
        "MVP behavior (per docs/01-mvp-spec.md): if the holder transfers",
        "shares between a deposit and a claim, the unclaimed portion on",
        "the transferred shares is forfeited - the calculation reads",
        "`holder_share_ata.amount` at claim time, not at deposit time.",
        "",
        "PDA seeds: `[b\"claim\", ip_work, holder]`"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "holder",
            "docs": [
              "The shareholder this record belongs to."
            ],
            "type": "pubkey"
          },
          {
            "name": "work",
            "docs": [
              "The work whose royalties this record tracks."
            ],
            "type": "pubkey"
          },
          {
            "name": "claimedAmount",
            "docs": [
              "Cumulative amount claimed by this holder (monotonic)."
            ],
            "type": "u64"
          },
          {
            "name": "lastClaimTotalDeposited",
            "docs": [
              "Snapshot of `RoyaltyVault.total_deposited` at the holder's",
              "last successful claim. Initialized to zero on first claim;",
              "any deposits before that point are claimable on first claim."
            ],
            "type": "u64"
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
    },
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
    },
    {
      "name": "listing",
      "docs": [
        "On-chain record of a fractional-share listing.",
        "",
        "Created by the work's creator after `create_work`. Locks",
        "`shares_available` shares into a vault token account whose authority",
        "is this Listing PDA, so the creator cannot pull them back without",
        "going through `buy_shares`.",
        "",
        "PDA seeds: `[b\"listing\", ip_work]`"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "work",
            "docs": [
              "The IpWork PDA this listing belongs to."
            ],
            "type": "pubkey"
          },
          {
            "name": "pricePerShare",
            "docs": [
              "Price per share, denominated in `payment_mint`'s smallest unit",
              "(e.g., 6 decimals for USDC: 1_000_000 == 1 USDC)."
            ],
            "type": "u64"
          },
          {
            "name": "sharesAvailable",
            "docs": [
              "Number of shares currently for sale (decreases on each buy)."
            ],
            "type": "u64"
          },
          {
            "name": "paymentMint",
            "docs": [
              "Mint of the payment token accepted. USDC devnet at launch;",
              "wSOL is a stretch."
            ],
            "type": "pubkey"
          },
          {
            "name": "vault",
            "docs": [
              "Vault token account holding the listed shares. Authority is",
              "this Listing PDA."
            ],
            "type": "pubkey"
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
    },
    {
      "name": "royaltyVault",
      "docs": [
        "On-chain ledger of a work's royalty inflows and outflows.",
        "",
        "Anyone (artist, distributor, manager, fan) can call",
        "`deposit_royalty` to fund this vault in `payment_mint`.",
        "Shareholders draw against it pro-rata via `claim_royalty`.",
        "",
        "PDA seeds: `[b\"royalty\", ip_work]`"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "work",
            "docs": [
              "The IpWork PDA this vault belongs to."
            ],
            "type": "pubkey"
          },
          {
            "name": "totalDeposited",
            "docs": [
              "Total amount ever deposited (monotonically increasing)."
            ],
            "type": "u64"
          },
          {
            "name": "totalClaimed",
            "docs": [
              "Total amount ever claimed across all holders."
            ],
            "type": "u64"
          },
          {
            "name": "paymentMint",
            "docs": [
              "Mint of the deposited token. Set on first deposit; immutable."
            ],
            "type": "pubkey"
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
