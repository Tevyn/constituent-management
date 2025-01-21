import React from 'react';
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import ConstituentForm from './ConstituentForm';

const Constituents = () => {
  const context = useContext(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Heading>Constituents</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Add New Constituent
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Constituent</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <ConstituentForm />
          </ModalBody>
        </ModalContent>
      </Modal>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Voter ID</Th>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Phone</Th>
            <Th>Precinct</Th>
          </Tr>
        </Thead>
        <Tbody>
          {context?.constituents.map((constituent) => (
            <Tr key={constituent.voter_id}>
              <Td>{constituent.voter_id}</Td>
              <Td>{`${constituent.first_name} ${constituent.last_name}`}</Td>
              <Td>{constituent.email}</Td>
              <Td>{constituent.phone}</Td>
              <Td>{constituent.voting_precinct}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Constituents; 