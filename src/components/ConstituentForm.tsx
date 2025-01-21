import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Constituent } from '../types';

const ConstituentForm = () => {
  const context = useContext(AppContext);
  const toast = useToast();

  const [formData, setFormData] = useState<Partial<Constituent>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_line1: '',
    city: '',
    state: '',
    zip: '',
    party_affiliation: '',
    preferred_contact_method: '',
    voting_precinct: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a simple unique ID (in production, this would come from the backend)
    const voter_id = `V${Date.now()}`;
    
    const newConstituent: Constituent = {
      ...formData,
      voter_id,
      date_of_birth: new Date(), // This should be properly collected
      registration_date: new Date(),
    } as Constituent;

    context?.addConstituent(newConstituent);
    
    toast({
      title: 'Constituent added.',
      description: "We've added the new constituent to the system.",
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    // Reset form
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address_line1: '',
      city: '',
      state: '',
      zip: '',
      party_affiliation: '',
      preferred_contact_method: '',
      voting_precinct: '',
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={4}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Phone</FormLabel>
          <Input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Address</FormLabel>
          <Input
            name="address_line1"
            value={formData.address_line1}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>City</FormLabel>
          <Input
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>State</FormLabel>
          <Input
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>ZIP Code</FormLabel>
          <Input
            name="zip"
            value={formData.zip}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Party Affiliation</FormLabel>
          <Select
            name="party_affiliation"
            value={formData.party_affiliation}
            onChange={handleChange}
          >
            <option value="">Select Party</option>
            <option value="Democratic">Democratic</option>
            <option value="Republican">Republican</option>
            <option value="Independent">Independent</option>
            <option value="Other">Other</option>
          </Select>
        </FormControl>

        <Button type="submit" colorScheme="blue">
          Add Constituent
        </Button>
      </VStack>
    </Box>
  );
};

export default ConstituentForm; 