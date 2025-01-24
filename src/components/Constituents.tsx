import { 
  Box, 
  Heading, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Button, 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody,
  ModalFooter,
  ModalCloseButton, 
  Tag, 
  Wrap, 
  WrapItem, 
  IconButton, 
  HStack, 
  useToast,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  TagLabel,
  TagCloseButton,
  FormControl,
  FormLabel,
  VStack,
  Select
} from '@chakra-ui/react';
import { useContext, useState, useMemo } from 'react';
import { AppContext } from '../contexts/AppContext';
import { EditIcon, DeleteIcon, AddIcon, SearchIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import { Constituent, Issue } from '../types';
import Issues from './Issues';

const Constituents = () => {
  const context = useContext(AppContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [editingConstituent, setEditingConstituent] = useState<Constituent | null>(null);
  const [selectedIssues, setSelectedIssues] = useState<Issue[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof Constituent>('last_name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const [formData, setFormData] = useState<Partial<Constituent>>({
    first_name: '',
    last_name: '',
    date_of_birth: undefined,
    email: '',
    phone: '',
    address_line1: '',
    city: '',
    state: '',
    zip: '',
    party_affiliation: '',
    preferred_contact_method: '',
    voting_precinct: '',
    registration_date: undefined
  });

  const sortedAndFilteredConstituents = useMemo(() => {
    let filtered = context?.constituents || [];
    
    // Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(constituent => 
        constituent.first_name.toLowerCase().includes(query) ||
        constituent.last_name.toLowerCase().includes(query) ||
        constituent.email.toLowerCase().includes(query) ||
        constituent.phone.includes(query) ||
        constituent.voting_precinct.toLowerCase().includes(query)
      );
    }

    // Sort
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField]?.toString().toLowerCase() || '';
      const bValue = b[sortField]?.toString().toLowerCase() || '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [context?.constituents, searchQuery, sortField, sortDirection]);

  const handleSort = (field: keyof Constituent) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: keyof Constituent }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />;
  };

  const handleCloseModal = () => {
    setFormData({
      first_name: '',
      last_name: '',
      date_of_birth: undefined,
      email: '',
      phone: '',
      address_line1: '',
      city: '',
      state: '',
      zip: '',
      party_affiliation: '',
      preferred_contact_method: '',
      voting_precinct: '',
      registration_date: undefined
    });
    setEditingConstituent(null);
    onClose();
  };

  // Get issues for a constituent using the constituentIssues mapping
  const getConstituentIssues = (voterId: string): Issue[] => {
    if (!context) return [];
    
    // Get all constituent issue mappings for this voter
    const constituentIssueMappings = context.constituentIssues.filter(
      ci => ci.constituentId === voterId
    );

    // Map the issue IDs to actual issue objects
    return constituentIssueMappings
      .map(mapping => context.issues.find(issue => issue.issue_id === mapping.issueId))
      .filter((issue): issue is Issue => issue !== undefined);
  };

  const handleRemoveIssue = (voterId: string, issueId: string) => {
    if (!context) return;
    
    // Use the context method to remove the constituent-issue mapping
    context.removeConstituentIssue(voterId, issueId);
    
    toast({
      title: "Issue removed from constituent",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAddIssue = (voterId: string, issueId: string) => {
    if (!context) return;

    // Create new constituent-issue mapping
    context.addConstituentIssue({
      constituentId: voterId,
      issueId: issueId,
      dateAdded: new Date().toISOString()
    });

    toast({
      title: "Issue added to constituent",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleEdit = (constituent: Constituent) => {
    setEditingConstituent(constituent);
    setFormData(constituent);
    onOpen();
  };

  const handleDelete = (voterId: string) => {
    if (!context) return;
    context.deleteConstituent(voterId);
    toast({
      title: "Constituent deleted",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = () => {
    if (!formData.first_name || !formData.last_name) {
      toast({
        title: "Error",
        description: "First name and last name are required",
        status: "error",
        duration: 3000,
        isClosable: true
      });
      return;
    }

    if (editingConstituent) {
      context?.updateConstituent({
        ...editingConstituent,
        ...formData
      } as Constituent);
    } else {
      context?.addConstituent({
        ...formData,
        voter_id: `V${Date.now()}`,
        registration_date: formData.registration_date || new Date()
      } as Constituent);
    }

    handleCloseModal();
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Heading>Constituents</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Add New Constituent
        </Button>
      </Box>

      <InputGroup mb={4} maxW="300px">
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search constituents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>

      <Modal isOpen={isOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingConstituent ? 'Edit Constituent' : 'Add New Constituent'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Date of Birth</FormLabel>
                <Input
                  type="date"
                  value={formData.date_of_birth instanceof Date ? formData.date_of_birth.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, date_of_birth: new Date(e.target.value)})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  value={formData.address_line1}
                  onChange={(e) => setFormData({...formData, address_line1: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>City</FormLabel>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>State</FormLabel>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>ZIP Code</FormLabel>
                <Input
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Party Affiliation</FormLabel>
                <Select
                  value={formData.party_affiliation}
                  onChange={(e) => setFormData({...formData, party_affiliation: e.target.value})}
                  placeholder="Select party affiliation"
                >
                  <option value="Democrat">Democrat</option>
                  <option value="Republican">Republican</option>
                  <option value="Independent">Independent</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Preferred Contact Method</FormLabel>
                <Select
                  value={formData.preferred_contact_method}
                  onChange={(e) => setFormData({...formData, preferred_contact_method: e.target.value})}
                  placeholder="Select preferred contact method"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="mail">Mail</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Voting Precinct</FormLabel>
                <Input
                  value={formData.voting_precinct}
                  onChange={(e) => setFormData({...formData, voting_precinct: e.target.value})}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Registration Date</FormLabel>
                <Input
                  type="date"
                  value={formData.registration_date instanceof Date ? formData.registration_date.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFormData({...formData, registration_date: new Date(e.target.value)})}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {editingConstituent ? 'Save Changes' : 'Add Constituent'}
            </Button>
            <Button onClick={handleCloseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={() => handleSort('last_name')}>
              Name <SortIcon field="last_name" />
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('email')}>
              Email <SortIcon field="email" />
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('phone')}>
              Phone <SortIcon field="phone" />
            </Th>
            <Th cursor="pointer" onClick={() => handleSort('voting_precinct')}>
              Precinct <SortIcon field="voting_precinct" />
            </Th>
            <Th>Issues</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedAndFilteredConstituents.map((constituent) => {
            const constituentIssues = getConstituentIssues(constituent.voter_id);
            
            return (
              <Tr key={constituent.voter_id}>
                <Td>{`${constituent.first_name} ${constituent.last_name}`}</Td>
                <Td>{constituent.email}</Td>
                <Td>{constituent.phone}</Td>
                <Td>{constituent.voting_precinct}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Wrap spacing={2}>
                      {constituentIssues.map(issue => (
                        <WrapItem key={issue.issue_id}>
                          <Tag size="sm" colorScheme="blue">
                            <TagLabel>{issue.title}</TagLabel>
                            <TagCloseButton 
                              onClick={() => handleRemoveIssue(constituent.voter_id, issue.issue_id)} 
                            />
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                    <Menu>
                      <MenuButton as={IconButton} icon={<AddIcon />} size="sm" variant="outline" />
                      <MenuList>
                        {context?.issues
                          .filter(issue => !constituentIssues
                            .some(existingIssue => existingIssue.issue_id === issue.issue_id))
                          .map(issue => (
                            <MenuItem 
                              key={issue.issue_id}
                              onClick={() => handleAddIssue(constituent.voter_id, issue.issue_id)}
                            >
                              {issue.title}
                            </MenuItem>
                          ))
                        }
                      </MenuList>
                    </Menu>
                  </HStack>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit constituent"
                      icon={<EditIcon />}
                      size="sm"
                      onClick={() => handleEdit(constituent)}
                    />
                    <IconButton
                      aria-label="Delete constituent"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(constituent.voter_id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Constituents;