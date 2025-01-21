import React from 'react';
import { Box, Heading } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box p={4} bg="blue.500">
      <Heading color="white">Constituent Management</Heading>
    </Box>
  );
};

export default Header;
