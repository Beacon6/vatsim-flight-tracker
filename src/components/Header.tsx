import { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Navbar from 'react-bootstrap/Navbar';

interface Props {
  pilotsCount?: number;
  controllersCount?: number;
  onSearch: (input?: string | number) => void;
}

function Header(props: Props) {
  const { pilotsCount, controllersCount, onSearch } = props;

  const [searchValue, setSearchValue] = useState<string | number>();

  function submitSearch(input: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(input.target.value.toUpperCase());
  }

  return (
    <>
      <Container className='header'>
        <Navbar className='header-topbar'>
          <Container className='header-item'>
            <Navbar.Brand className='header-brand' href='#'>
              {'Vatsim Flight Tracker'}
            </Navbar.Brand>
          </Container>
          <Container className='header-item'>
            <Navbar.Text>Pilots connected: {pilotsCount}</Navbar.Text>
            <Navbar.Text>ATC connected: {controllersCount}</Navbar.Text>
          </Container>
          <Container className='header-item'>
            <InputGroup className='d-flex'>
              <InputGroup.Text>CID / Callsign</InputGroup.Text>
              <Form.Control type='text' placeholder='Search' onChange={submitSearch} />
            </InputGroup>
            <Button
              variant='outline-primary'
              id='search-button'
              onClick={() => {
                onSearch(searchValue);
              }}
            >
              <i className='bi bi-search'></i>
            </Button>
          </Container>
        </Navbar>
      </Container>
    </>
  );
}

export default Header;
