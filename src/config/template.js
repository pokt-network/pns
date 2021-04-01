export const PnsTemplate = {
    // Dry run option
    dryRun: false,
    // VM's configurations
    seeds: {
        amount: 2,
        machineType: "e2-standard-32",
        processes: 5,
        inboundPeers: 100000,
        outboundPeers: 100,
        tendermintMaxConns: 150000,
        diskSizeGb: "200",
        ulimit: "200000"
    },
    initialValidators: {
        amount: 200,
        machineType: "e2-standard-32",
        chains: ["0001"],
        processes: 25,
        inboundPeers: 500,
        outboundPeers: 20,
        tendermintMaxConns: 1000,
        diskSizeGb: "200",
        ulimit: "16384"
    },
    validators: {
        amount: 0,
        machineType: "e2-standard-4",
        processes: 20,
    },
    relayers: {
        machineType: "e2-standard-32",
        amount: 200,
        testType: "dispatch",
        processes: 25,
        branch: "origin/staging",
        diskSizeGb: "100",
        config: {
            chains: [],
            session_block_frequency: 4,
            block_time: 900000,
            relay_timeout: 0,
            parallel_relays: 1,
            dispatchers: [],
            data_dir: "/home/luis_pokt_network/prlts_data",
            log_level: "error",
            logs_to_console: false,
            faucet_pk: null,
            chain_id: "loadnet",
        },
    },
    // Infrastructure configuration
    network: {
        name: "default",
        range: "10.128.0.0/19",
    },
    zone: "us-central1-c",
    projectID: "validator-load-test",
    // Pocket Core configurations
    pocketCore: {
        branch: "staging",
        genesisTemplate: {
            "genesis_time": "2020-07-28T15:00:00.000000Z",
            "chain_id": "loadnet",
            "consensus_params": {
                "block": {
                    "max_bytes": "2000000",
                    "max_gas": "-1",
                    "time_iota_ms": "1"
                },
                "evidence": {
                    "max_age": "120000000000"
                },
                "validator": {
                    "pub_key_types": [
                        "ed25519"
                    ]
                }
            },
            "app_hash": "",
            "app_state": {
                "application": {
                    "params": {
                        "unstaking_time": "1814000000000000",
                        "max_applications": "9223372036854775807",
                        "app_stake_minimum": "1000000",
                        "base_relays_per_pokt": "167",
                        "stability_adjustment": "0",
                        "participation_rate_on": false,
                        "maximum_chains": "15"
                    },
                    "applications": [],
                    "exported": false
                },
                "auth": {
                    "params": {
                        "max_memo_characters": "75",
                        "tx_sig_limit": "8",
                        "fee_multipliers": {
                            "fee_multiplier": [],
                            "default": "1"
                        }
                    },
                    "accounts": [
                        
                    ],
                    "supply": []
                },
                "gov": {
                    "params": {
                        "acl": [
                            {
                                "acl_key": "application/ApplicationStakeMinimum",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "application/AppUnstakingTime",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "application/BaseRelaysPerPOKT",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "application/MaxApplications",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "application/MaximumChains",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "application/ParticipationRateOn",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "application/StabilityAdjustment",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "auth/MaxMemoCharacters",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "auth/TxSigLimit",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "gov/acl",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "gov/daoOwner",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "gov/upgrade",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pocketcore/ClaimExpiration",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "auth/FeeMultipliers",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pocketcore/ReplayAttackBurnMultiplier",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/ProposerPercentage",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pocketcore/ClaimSubmissionWindow",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pocketcore/MinimumNumberOfProofs",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pocketcore/SessionNodeCount",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pocketcore/SupportedBlockchains",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/BlocksPerSession",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/DAOAllocation",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/DowntimeJailDuration",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/MaxEvidenceAge",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/MaximumChains",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/MaxJailedBlocks",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/MaxValidators",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/MinSignedPerWindow",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/RelaysToTokensMultiplier",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/SignedBlocksWindow",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/SlashFractionDoubleSign",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/SlashFractionDowntime",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/StakeDenom",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/StakeMinimum",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            },
                            {
                                "acl_key": "pos/UnstakingTime",
                                "address": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4"
                            }
                        ],
                        "dao_owner": "a83172b67b5ffbfcb8acb95acc0fd0466a9d4bc4",
                        "upgrade": {
                            "Height": "0",
                            "Version": "0"
                        }
                    },
                    "DAO_Tokens": "50000000000000"
                },
                "pos": {
                    "params": {
                        "relays_to_tokens_multiplier": "10000",
                        "unstaking_time": "1814000000000000",
                        "max_validators": "1000",
                        "stake_denom": "upokt",
                        "stake_minimum": "15000000000",
                        "session_block_frequency": "4",
                        "dao_allocation": "10",
                        "proposer_allocation": "1",
                        "maximum_chains": "15",
                        "max_jailed_blocks": "37960",
                        "max_evidence_age": "120000000000",
                        "signed_blocks_window": "10",
                        "min_signed_per_window": "0.60",
                        "downtime_jail_duration": "3600000000000",
                        "slash_fraction_double_sign": "0.05",
                        "slash_fraction_downtime": "0.000001"
                    },
                    "prevState_total_power": "0",
                    "prevState_validator_powers": null,
                    "validators": [
                    ],
                    "exported": false,
                    "signing_infos": {},
                    "missed_blocks": {},
                    "previous_proposer": ""
                },
                "pocketcore": {
                    "params": {
                        "session_node_count": "5",
                        "proof_waiting_period": "3",
                        "supported_blockchains": [
                            "0001"
                        ],
                        "claim_expiration": "120",
                        "replay_attack_burn_multiplier": "3",
                        "minimum_number_of_proofs": "10"
                    },
                    "receipts": null,
                    "claims": null
                }
            }
        },
        configTemplate: {
            "tendermint_config": {
                "RootDir": "/root/.pocket",
                "ProxyApp": "tcp://127.0.0.1:26658",
                "Moniker": "",
                "FastSyncMode": true,
                "DBBackend": "goleveldb",
                "LevelDBOptions": {
                    "block_cache_capacity": 83886,
                    "block_cache_evict_removed": false,
                    "block_size": 4096,
                    "disable_buffer_pool": true,
                    "open_files_cache_capacity": -1,
                    "write_buffer": 838860
                },
                "DBPath": "data",
                "LogLevel": "*:info, *:error",
                "LogFormat": "plain",
                "Genesis": "config/genesis.json",
                "PrivValidatorKey": "priv_val_key.json",
                "PrivValidatorState": "priv_val_state.json",
                "PrivValidatorListenAddr": "",
                "NodeKey": "node_key.json",
                "ABCI": "socket",
                "ProfListenAddress": "",
                "FilterPeers": false,
                "RPC": {
                    "RootDir": "/root/.pocket",
                    "ListenAddress": "tcp://127.0.0.1:26657",
                    "CORSAllowedOrigins": [],
                    "CORSAllowedMethods": [
                        "HEAD",
                        "GET",
                        "POST"
                    ],
                    "CORSAllowedHeaders": [
                        "Origin",
                        "Accept",
                        "Content-Type",
                        "X-Requested-With",
                        "X-Server-Time"
                    ],
                    "GRPCListenAddress": "",
                    "GRPCMaxOpenConnections": 83,
                    "Unsafe": false,
                    "MaxOpenConnections": 83,
                    "MaxSubscriptionClients": 100,
                    "MaxSubscriptionsPerClient": 5,
                    "TimeoutBroadcastTxCommit": 10000000000,
                    "MaxBodyBytes": 1000000,
                    "MaxHeaderBytes": 1048576,
                    "TLSCertFile": "",
                    "TLSKeyFile": ""
                },
                "P2P": {
                    "RootDir": "/root/.pocket",
                    "ListenAddress": "tcp://0.0.0.0:26656",
                    "ExternalAddress": "",
                    "Seeds": "",
                    "PersistentPeers": "",
                    "UPNP": false,
                    "AddrBook": "config/addrbook.json",
                    "AddrBookStrict": false,
                    "MaxNumInboundPeers": 10,
                    "MaxNumOutboundPeers": 10,
                    "UnconditionalPeerIDs": "",
                    "PersistentPeersMaxDialPeriod": 0,
                    "FlushThrottleTimeout": 100000000,
                    "MaxPacketMsgPayloadSize": 1024,
                    "SendRate": 5120000,
                    "RecvRate": 5120000,
                    "PexReactor": true,
                    "SeedMode": false,
                    "PrivatePeerIDs": "",
                    "AllowDuplicateIP": true,
                    "HandshakeTimeout": 20000000000,
                    "DialTimeout": 3000000000,
                    "TestDialFail": false,
                    "TestFuzz": false,
                    "TestFuzzConfig": {
                        "Mode": 0,
                        "MaxDelay": 3000000000,
                        "ProbDropRW": 0.2,
                        "ProbDropConn": 0,
                        "ProbSleep": 0
                    }
                },
                "Mempool": {
                    "RootDir": "/root/.pocket",
                    "Recheck": true,
                    "Broadcast": true,
                    "WalPath": "",
                    "Size": 9000,
                    "MaxTxsBytes": 1073741824,
                    "CacheSize": 9000,
                    "MaxTxBytes": 1048576
                },
                "FastSync": {
                    "Version": "v1"
                },
                "Consensus": {
                    "RootDir": "/root/.pocket",
                    "WalPath": "data/cs.wal/wal",
                    "TimeoutPropose": 600000000000,
                    "TimeoutProposeDelta": 10000000000,
                    "TimeoutPrevote": 300000000000,
                    "TimeoutPrevoteDelta": 10000000000,
                    "TimeoutPrecommit": 300000000000,
                    "TimeoutPrecommitDelta": 10000000000,
                    "TimeoutCommit": 300000000000,
                    "SkipTimeoutCommit": false,
                    "CreateEmptyBlocks": true,
                    "CreateEmptyBlocksInterval": 900000000000,
                    "PeerGossipSleepDuration": 30000000000,
                    "PeerQueryMaj23SleepDuration": 30000000000
                },
                "TxIndex": {
                    "Indexer": "kv",
                    "IndexKeys": "tx.hash,tx.height,message.sender,transfer.recipient",
                    "IndexAllKeys": false
                },
                "Instrumentation": {
                    "Prometheus": false,
                    "PrometheusListenAddr": ":26660",
                    "MaxOpenConnections": 3,
                    "Namespace": "tendermint"
                }
            },
            "pocket_config": {
                "data_dir": "/root/.pocket",
                "genesis_file": "genesis.json",
                "chains_name": "chains.json",
                "session_db_name": "session",
                "evidence_db_name": "pocket_evidence",
                "tendermint_uri": "tcp://localhost:26657",
                "keybase_name": "pocket-keybase",
                "rpc_port": "8081",
                "client_block_sync_allowance": 10,
                "max_evidence_cache_entries": 500,
                "max_session_cache_entries": 500,
                "json_sort_relay_responses": true,
                "remote_cli_url": "http://localhost:8081",
                "user_agent": "",
                "validator_cache_size": 100,
                "application_cache_size": 100,
                "rpc_timeout": 3000,
                "pocket_prometheus_port": "8083",
                "prometheus_max_open_files": 3,
                "max_claim_age_for_proof_retry": 32,
                "proof_prevalidation": false,
                "ctx_cache_size": 20,
                "abci_logging": false,
                "show_relay_errors": true
            }
        },
    },
    genesis: {
        chainId: "loadnet",
        defaultAccountAmount: "1000000000",
        defaultValidatorStake: "16000000000",
        defaultApplicationStake: "2500000000",
        defaultApplicationMaxRelays: "4170",
        applicationsAmount: 1000,
    },
}
