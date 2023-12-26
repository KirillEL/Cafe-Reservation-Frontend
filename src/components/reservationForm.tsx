import { Text, VStack } from "@chakra-ui/react";

const ReservationForm: React.FC = () => {
    return (
        <VStack spacing={4}>
          <Text className="text-2xl font-semibold text-coffee-dark">Reserve a Table</Text>
          {/* ...rest of your form... */}
        </VStack>
    );
};

export default ReservationForm;