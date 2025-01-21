import { Box, Flex } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LeftNav from './components/LeftNav';
import Dashboard from './components/Dashboard';
import Constituents from './components/Constituents';
import Issues from './components/Issues';
import { AppContextProvider } from './contexts/AppContext';

function App() {
  return (
    <AppContextProvider>
      <Box>
        <Header />
        <Flex>
          <LeftNav />
          <Box flex={1} p={4}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/constituents" element={<Constituents />} />
              <Route path="/issues" element={<Issues />} />
            </Routes>
          </Box>
        </Flex>
      </Box>
    </AppContextProvider>
  );
}

export default App;
