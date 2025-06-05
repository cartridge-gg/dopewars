use starknet::ContractAddress;

#[derive(IntrospectPacked, Copy, Drop, Serde)]
#[dojo::model]
pub struct RyoAddress {
    #[key]
    pub key: u8,
    pub paper: ContractAddress,
    pub treasury: ContractAddress,
    pub vrf: ContractAddress,
}
