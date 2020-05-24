export const PnsTemplate = {
    // Dry run option
    dryRun: false,
    // VM's configurations
    seeds: {
        amount: 2,
        machineType: "e2-standard-2",
    },
    initialValidators: {
        amount: 5,
        machineType: "e2-standard-2",
        chains: ["0001"],
    },
    validators: {
        amount: 5,
        machineType: "e2-standard-2"
    },
    relayers: {
        amount: 0,
        testType: "transaction",
        processes: 1,
        branch: "origin/issue-#22",
        config: {
            chains: [],
            session_block_frequency: 4,
            block_time: 900000,
            relay_timeout: 0,
            parallel_relays: 5,
            dispatchers: [],
            data_dir: "/root/prlts",
            log_level: "debug",
            logs_to_console: true,
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
        branch: "origin/staging",
        genesisTemplate: {
            genesis_time: "2020-05-07T00:00:00.000000Z",
            chain_id: "loadnet",
            consensus_params: {
                block: {
                    max_bytes: "4000000",
                    max_gas: "-1",
                    time_iota_ms: "1",
                },
                evidence: {
                    max_age: "1000000",
                },
                validator: {
                    pub_key_types: ["ed25519"],
                },
            },
            app_hash: "",
            app_state: {
                supply: {
                    supply: [],
                },
                pocketcore: {
                    params: {
                        session_node_count: "5",
                        proof_waiting_period: "3",
                        supported_blockchains: ["0001"],
                        claim_expiration: "100",
                    },
                    proofs: null,
                    claims: null,
                },
                application: {
                    params: {
                        unstaking_time: "60000000000",
                        max_applications: "18446744073709551615",
                        app_stake_minimum: "1000000",
                        base_relays_per_pokt: "100",
                        stability_adjustment: "0",
                        participation_rate_on: false,
                    },
                    applications: [],
                    exported: false,
                },
                gov: {
                    params: {
                        acl: [
                            {
                                acl_key: "auth/MaxMemoCharacters",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "auth/TxSigLimit",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "gov/daoOwner",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "gov/acl",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/StakeDenom",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pocketcore/SupportedBlockchains",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/DowntimeJailDuration",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/SlashFractionDoubleSign",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/SlashFractionDowntime",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "application/ApplicationStakeMinimum",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pocketcore/ClaimExpiration",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pocketcore/SessionNodeCount",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key:
                                    "pocketcore/ReplayAttackBurnMultiplier",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/MaxValidators",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/ProposerPercentage",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "application/StabilityAdjustment",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "application/AppUnstakingTime",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "application/ParticipationRateOn",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/MaxEvidenceAge",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/MinSignedPerWindow",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/StakeMinimum",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/UnstakingTime",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "application/BaseRelaysPerPOKT",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pocketcore/ClaimSubmissionWindow",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/DAOAllocation",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/SignedBlocksWindow",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/BlocksPerSession",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "application/MaxApplications",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "gov/upgrade",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/MaximumChains",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "application/MaximumChains",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/MaxJailedBlocks",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pos/RelaysToTokensMultiplier",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                            {
                                acl_key: "pocketcore/MinimumNumberOfProofs",
                                address:
                                    "3b74022ff2f29282f440bf21a77919234449a044",
                            },
                        ],
                        dao_owner: "3b74022ff2f29282f440bf21a77919234449a044",
                        upgrade: {
                            Height: "0",
                            Version: "0",
                        },
                    },
                    DAO_Tokens: "0",
                },
                auth: {
                    params: {
                        max_memo_characters: "256",
                        tx_sig_limit: "7",
                        tx_size_cost_per_byte: "10",
                    },
                    accounts: [],
                },
                bank: {
                    send_enabled: true,
                },
                params: null,
                pos: {
                    params: {
                        unstaking_time: "60000000000",
                        max_validators: "5000",
                        stake_denom: "upokt",
                        stake_minimum: "1000000",
                        session_block_frequency: "4",
                        dao_allocation: "10",
                        proposer_allocation: "1",
                        max_evidence_age: "120000000000",
                        signed_blocks_window: "100",
                        min_signed_per_window: "0.500000000000000000",
                        downtime_jail_duration: "600000000000",
                        slash_fraction_double_sign: "0.050000000000000000",
                        slash_fraction_downtime: "0.010000000000000000",
                    },
                    prevState_total_power: "0",
                    prevState_validator_powers: null,
                    validators: [],
                    exported: false,
                    dao: {
                        Tokens: "0",
                    },
                    signing_infos: {},
                    missed_blocks: {},
                    previous_proposer: "",
                },
            },
        },
        configTemplate: {
            tendermint_config: {
                RootDir: "/root/.pocket",
                ProxyApp: "tcp://127.0.0.1:26658",
                Moniker: "",
                FastSyncMode: true,
                DBBackend: "goleveldb",
                DBPath: "data",
                LogLevel: "*:debug, *:info, *:error",
                LogFormat: "plain",
                Genesis: "config/genesis.json",
                PrivValidatorKey: "priv_val_key.json",
                PrivValidatorState: "priv_val_state.json",
                PrivValidatorListenAddr: "",
                NodeKey: "node_key.json",
                ABCI: "socket",
                ProfListenAddress: "",
                FilterPeers: false,
                RPC: {
                    RootDir: "/root/.pocket",
                    ListenAddress: "tcp://127.0.0.1:26657",
                    CORSAllowedOrigins: [],
                    CORSAllowedMethods: ["HEAD", "GET", "POST"],
                    CORSAllowedHeaders: [
                        "Origin",
                        "Accept",
                        "Content-Type",
                        "X-Requested-With",
                        "X-Server-Time",
                    ],
                    GRPCListenAddress: "",
                    GRPCMaxOpenConnections: 900,
                    Unsafe: false,
                    MaxOpenConnections: 900,
                    MaxSubscriptionClients: 100,
                    MaxSubscriptionsPerClient: 5,
                    TimeoutBroadcastTxCommit: 10000000000,
                    MaxBodyBytes: 1000000,
                    MaxHeaderBytes: 1048576,
                    TLSCertFile: "",
                    TLSKeyFile: "",
                },
                P2P: {
                    RootDir: "/root/.pocket",
                    ListenAddress: "tcp://0.0.0.0:26656",
                    ExternalAddress: "",
                    Seeds: "",
                    PersistentPeers: "",
                    UPNP: false,
                    AddrBook: "config/addrbook.json",
                    AddrBookStrict: false,
                    MaxNumInboundPeers: 250,
                    MaxNumOutboundPeers: 250,
                    FlushThrottleTimeout: 100000000,
                    MaxPacketMsgPayloadSize: 1024,
                    SendRate: 5120000,
                    RecvRate: 5120000,
                    PexReactor: true,
                    SeedMode: false,
                    PrivatePeerIDs: "",
                    AllowDuplicateIP: false,
                    HandshakeTimeout: 20000000000,
                    DialTimeout: 3000000000,
                    TestDialFail: false,
                    TestFuzz: false,
                    TestFuzzConfig: {
                        Mode: 0,
                        MaxDelay: 3000000000,
                        ProbDropRW: 0.2,
                        ProbDropConn: 0,
                        ProbSleep: 0,
                    },
                },
                Mempool: {
                    RootDir: "/root/.pocket",
                    Recheck: true,
                    Broadcast: true,
                    WalPath: "",
                    Size: 5000,
                    MaxTxsBytes: 1073741824,
                    CacheSize: 10000,
                    MaxTxBytes: 1048576,
                },
                FastSync: {
                    Version: "v0",
                },
                Consensus: {
                    RootDir: "/root/.pocket",
                    WalPath: "data/cs.wal/wal",
                    TimeoutPropose: 3000000000,
                    TimeoutProposeDelta: 500000000,
                    TimeoutPrevote: 1000000000,
                    TimeoutPrevoteDelta: 500000000,
                    TimeoutPrecommit: 1000000000,
                    TimeoutPrecommitDelta: 500000000,
                    TimeoutCommit: 60000000000,
                    SkipTimeoutCommit: false,
                    CreateEmptyBlocks: true,
                    CreateEmptyBlocksInterval: 60000000000,
                    PeerGossipSleepDuration: 100000000,
                    PeerQueryMaj23SleepDuration: 2000000000,
                },
                TxIndex: {
                    Indexer: "kv",
                    IndexTags:
                        "tx.hash,tx.height,message.sender,transfer.recipient",
                    IndexAllTags: false,
                },
                Instrumentation: {
                    Prometheus: false,
                    PrometheusListenAddr: ":26660",
                    MaxOpenConnections: 3,
                    Namespace: "tendermint",
                },
            },
            pocket_config: {
                data_dir: "/root/.pocket",
                genesis_file: "genesis.json",
                chains_name: "chains.json",
                session_db_type: "goleveldb",
                session_db_name: "session",
                evidence_db_type: "goleveldb",
                evidence_db_name: "pocket_evidence",
                tendermint_uri: "tcp://localhost:26657",
                keybase_name: "pocket-keybase",
                rpc_port: "8081",
                client_block_sync_allowance: 10,
                max_evidence_cache_entries: 100,
                max_session_cache_entries: 100,
                json_sort_relay_responses: true,
                remote_cli_url: "http://localhost:8081",
                user_agent: "",
                validator_cache_size: 500,
                application_cache_size: 500,
            },
        },
    },
    genesis: {
        chainId: "loadnet",
        defaultAccountAmount: "1000000000",
        defaultValidatorStake: "1000000000",
        defaultApplicationStake: "1000000000",
        defaultApplicationMaxRelays: "1000000000",
        applicationsAmont: 0,
    },
}
