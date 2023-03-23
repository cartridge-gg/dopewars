import { Flex } from "@chakra-ui/layout";
import { Product } from "./Products";

interface ProductProps {
    product: Product;
    isBuying: boolean;
}

const Product = ({ product, isBuying }: ProductProps) => {
return (
        <Flex borderRadius={4} border="2px solid black" bg="#141011>
            
        </Flex>
    );
};

export default Product;