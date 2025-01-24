import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, Input, Select, Textarea, useDisclosure, useToast } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { AppContext } from '../contexts/AppContext';
import React from 'react';
import { Issue } from '../types';
import { AddIcon } from '@chakra-ui/icons';

interface IssuesProps {
  modalOnly?: boolean;
  onIssueCreated?: (issue: Issue) => void;
}

const Issues: React.FC<IssuesProps> = ({ modalOnly = false, onIssueCreated }) => {
  const context = useContext(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    official_stance: '',
    status: 'new'
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      // Initial phases
      case 'new':
        return 'gray';
      case 'needs constituent input':
        return 'orange';
      
      // Planning phases  
      case 'implementation planning':
        return 'blue';
      case 'resource allocation':
        return 'cyan';
      case 'multi-agency coordination':
        return 'teal';
        
      // Legislative phases
      case 'legislation drafted':
        return 'purple';
      case 'public review period':
        return 'pink';
      case 'in committee':
        return 'linkedin';
      case 'scheduled for vote':
        return 'facebook';
        
      // Active phases
      case 'in progress':
        return 'green';
      case 'blocked':
        return 'red';
        
      // Closure phases
      case 'resolved':
        return 'gray';
      case 'referred':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewIssue(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIssue.title || !newIssue.description) {
      toast({
        title: 'Error',
        description: 'Title and description are required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const issue: Issue = {
      ...newIssue,
      issue_id: `I${Date.now()}`,
      created_date: new Date(),
      last_updated: new Date()
    };

    context?.addIssue(issue);
    
    if (onIssueCreated) {
      onIssueCreated(issue);
    }

    toast({
      title: 'Issue created',
      description: "We've added the new issue to the system.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    setNewIssue({
      title: '',
      description: '',
      official_stance: '',
      status: 'new'
    });
    onClose();
  };

  // If modalOnly is true, only render the Modal
  if (modalOnly) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create New Issue</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <FormControl isRequired mb={4}>
                <FormLabel>Title</FormLabel>
                <Input name="title" value={newIssue.title} onChange={handleChange} />
              </FormControl>

              <FormControl isRequired mb={4}>
                <FormLabel>Description</FormLabel>
                <Textarea name="description" value={newIssue.description} onChange={handleChange} />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Official Stance</FormLabel>
                <Textarea name="official_stance" value={newIssue.official_stance} onChange={handleChange} />
              </FormControl>

              <FormControl mb={4}>
                <FormLabel>Status</FormLabel>
                <Select name="status" value={newIssue.status} onChange={handleChange}>
                  {/* Initial phases */}
                  <option value="new">New</option>
                  <option value="needs constituent input">Needs Constituent Input</option>
                  
                  {/* Planning phases */}
                  <option value="implementation planning">Implementation Planning</option>
                  <option value="resource allocation">Resource Allocation</option>
                  <option value="multi-agency coordination">Multi-Agency Coordination</option>
                  
                  {/* Legislative phases */}
                  <option value="legislation drafted">Legislation Drafted</option>
                  <option value="public review period">Public Review Period</option>
                  <option value="in committee">In Committee</option>
                  <option value="scheduled for vote">Scheduled for Vote</option>
                  
                  {/* Active phases */}
                  <option value="in progress">In Progress</option>
                  <option value="blocked">Blocked</option>
                  
                  {/* Closure phases */}
                  <option value="resolved">Resolved</option>
                  <option value="referred">Referred</option>
                </Select>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} type="submit">
                Create Issue
              </Button>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Heading>Issues</Heading>
        <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={onOpen}>
          New Issue
        </Button>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th>Official Stance</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {context?.issues.map((issue) => (
            <Tr key={issue.issue_id}>
              <Td>{issue.title}</Td>
              <Td>{issue.description}</Td>
              <Td>{issue.official_stance}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(issue.status)}>
                  {issue.status}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Issues;