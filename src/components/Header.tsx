import { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

const Header: React.FC<{
  pilotsCount?: number;
  atcCount?: number;
  onSearch: (value?: string) => void;
}> = (props) => {
  const { pilotsCount, atcCount, onSearch } = props;

  const [inputValue, setInputValue] = useState<string>();

  const changeInputValue = (value: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(value.target.value);
  };

  return (
    <>
      <Container className='header-container'>
        <Navbar className='header'>
          <Container className='header-element'>
            <Navbar.Brand href='#'>VATSIM Flight Tracker</Navbar.Brand>
          </Container>
          <Container className='header-element'>
            <Navbar.Text>Pilots connected: {pilotsCount}</Navbar.Text>
            <Navbar.Text>ATC connected: {atcCount}</Navbar.Text>
          </Container>
          <Container className='header-element'>
            <InputGroup className='d-flex'>
              <InputGroup.Text>CID / Callsign</InputGroup.Text>
              <Form.Control
                type='text'
                placeholder='1590612 / AUA546'
                onChange={changeInputValue}
              />
              <Button
                variant='outline-success'
                id='search-button'
                onClick={() => {
                  onSearch(inputValue);
                }}
              >
                Search
              </Button>
            </InputGroup>
          </Container>
        </Navbar>
      </Container>
    </>
  );
};

export default Header;
