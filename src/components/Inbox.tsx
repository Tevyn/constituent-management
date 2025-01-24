import React, { useContext, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  Button,
  Textarea,
  Grid,
  GridItem,
  List,
  ListItem,
  Badge,
} from '@chakra-ui/react';
import { AppContext } from '../contexts/AppContext';
import { Communication, Issue } from '../types';

const Inbox = () => {
  const context = useContext(AppContext);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [editedReply, setEditedReply] = useState('');

  if (!context) {
    return <Box>Loading...</Box>;
  }

  const getConstituent = (constituentId: string) => {
    return context.constituents.find(c => c.voter_id === constituentId);
  };

  const formatDate = (date: Date | string) => {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    return new Date(date).toLocaleDateString();
  };

  const getPreviewText = (message: string) => {
    const firstLine = message.split('\n')[0];
    return firstLine.length > 100 ? firstLine.substring(0, 100) + '...' : firstLine;
  };

  const handleSelectMessage = (communication: Communication) => {
    setSelectedCommunication(communication);
    setEditedReply(communication.draft_reply);
  };

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

  return (
    <Box h="calc(100vh - 100px)">
      <Heading mb={6}>Inbox</Heading>

      <Grid
        templateColumns="350px 1fr 1fr"
        gap={4}
        h="90%"
      >
        {/* Left Pane - Message List */}
        <GridItem borderRight="1px" borderColor="gray.200" overflowY="auto">
          <List spacing={0}>
            {context.communications?.map((comm) => {
              const constituent = getConstituent(comm.constituent_id);
              return (
                <ListItem 
                  key={comm.communication_id}
                  p={4}
                  cursor="pointer"
                  bg={selectedCommunication?.communication_id === comm.communication_id ? 'gray.100' : 'white'}
                  _hover={{ bg: 'gray.50' }}
                  borderBottom="1px"
                  borderColor="gray.200"
                  onClick={() => handleSelectMessage(comm)}
                >
                  <Text fontWeight="bold">
                    {constituent ? `${constituent.first_name} ${constituent.last_name}` : 'Unknown Constituent'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">{formatDate(comm.date_received)}</Text>
                  <Text noOfLines={2} fontSize="sm">{getPreviewText(comm.message)}</Text>
                </ListItem>
              );
            })}
          </List>
        </GridItem>

        {/* Middle Pane - Full Message */}
        <GridItem overflowY="auto" p={4}>
          {selectedCommunication ? (
            <VStack align="stretch" spacing={4}>
              <Box>
                <HStack justify="space-between">
                  <Text fontWeight="bold">
                    {getConstituent(selectedCommunication.constituent_id)?.first_name}{' '}
                    {getConstituent(selectedCommunication.constituent_id)?.last_name}
                  </Text>
                  <Text color="gray.500">{formatDate(selectedCommunication.date_received)}</Text>
                </HStack>
              </Box>
              <Box>
                <Text whiteSpace="pre-wrap">{selectedCommunication.message}</Text>
              </Box>
            </VStack>
          ) : (
            <Text color="gray.500">Select a message to view</Text>
          )}
        </GridItem>

        {/* Right Pane - Issues and Reply */}
        <GridItem borderLeft="1px" borderColor="gray.200">
          {selectedCommunication ? (
            <VStack h="100%" spacing={0}>
              {/* Issues Section */}
              <Box p={4} borderBottom="1px" borderColor="gray.200" w="100%">
                <Text fontWeight="bold" mb={2}>Issues:</Text>
                <HStack spacing={2} flexWrap="wrap">
                  {selectedCommunication.linked_issues?.map((linkedIssue) => {
                    const issue = context.issues?.find(i => i.issue_id === linkedIssue.issue_id);
                    return (
                      <Badge key={linkedIssue.issue_id} colorScheme={getStatusColor(issue?.status || '')}>
                        {issue?.title || 'Unknown Issue'}
                      </Badge>
                    );
                  })}
                </HStack>
              </Box>

              {/* Reply Section */}
              <Box p={4} flex={1} w="100%">
                <Text fontWeight="bold" mb={2}>Draft Reply:</Text>
                <VStack h="100%" spacing={4}>
                  <Textarea
                    value={editedReply}
                    onChange={(e) => setEditedReply(e.target.value)}
                    flex={1}
                    resize="none"
                  />
                  <Button colorScheme="blue" alignSelf="flex-end">
                    Send Reply
                  </Button>
                </VStack>
              </Box>
            </VStack>
          ) : (
            <Text p={4} color="gray.500">Select a message to view details</Text>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Inbox;