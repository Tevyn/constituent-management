import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge } from '@chakra-ui/react';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import React from 'react';

const Issues = () => {
  const context = useContext(AppContext);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'resolved':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Box>
      <Heading mb={4}>Issues</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Title</Th>
            <Th>Status</Th>
            <Th>Created Date</Th>
            <Th>Last Updated</Th>
          </Tr>
        </Thead>
        <Tbody>
          {context?.issues.map((issue) => (
            <Tr key={issue.issue_id}>
              <Td>{issue.issue_id}</Td>
              <Td>{issue.title}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(issue.status)}>
                  {issue.status}
                </Badge>
              </Td>
              <Td>{issue.created_date.toLocaleDateString()}</Td>
              <Td>{issue.last_updated.toLocaleDateString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Issues; 