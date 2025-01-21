import React from 'react';
import { Box, VStack, Link } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

const LeftNav = () => {
  return (
    <Box w="200px" p={4} bg="gray.100" minH="100vh">
      <VStack align="stretch" spacing={4}>
        <Link as={RouterLink} to="/">Dashboard</Link>
        <Link as={RouterLink} to="/constituents">Constituents</Link>
        <Link as={RouterLink} to="/issues">Issues</Link>
        <Link as={RouterLink} to="/communications">Communications</Link>
        <Link as={RouterLink} to="/content-calendar">Content Calendar</Link>
      </VStack>
    </Box>
  );
};

export default LeftNav; 