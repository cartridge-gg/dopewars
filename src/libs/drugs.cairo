use starknet::ContractAddress;

#[starknet::interface]
trait IDrugs<TContractState> {

}


//#[dojo::library]
#[dojo::contract]
mod drugs {
    
    #[external(v0)]
    impl DrugsImpl of super::IDrugs<ContractState> {
       
    }

}

