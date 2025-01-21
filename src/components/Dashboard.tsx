import React from 'react';
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const Dashboard = () => {
  const context = useContext(AppContext);

  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat>
          <StatLabel>Total Constituents</StatLabel>
          <StatNumber>{context?.constituents.length || 0}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Active Issues</StatLabel>
          <StatNumber>{context?.issues.length || 0}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Issue Engagements</StatLabel>
          <StatNumber>{context?.constituentIssues.length || 0}</StatNumber>
        </Stat>
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
