import { useDojoContext } from "@/dojo/hooks/useDojoContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

 const RegisterEntities = () => {
    const router = useRouter();
    const gameId = router.query.gameId as string;

    const { account, playerEntityStore} = useDojoContext()

    useEffect(()=> {
        if( playerEntityStore && gameId && account?.address){
          console.log('Register PlayerEntity')
          playerEntityStore.initPlayerEntity(gameId, account?.address);
        }

        if(!gameId){
          playerEntityStore.reset();
        }
      }, [gameId, account?.address/*, playerEntityStore*/])


    return (<></>)
    
};

  export default RegisterEntities; 




