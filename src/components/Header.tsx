import { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

const Header: React.FC<{
  pilotsCount?: number;
  atcCount?: number;
  onSearch: (value?: string | number) => void;
  isDev: boolean;
}> = (props) => {
  const { pilotsCount, atcCount, onSearch, isDev } = props;

  const [inputValue, setInputValue] = useState<string | number>();

  const changeInputValue = (value: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(value.target.value);
  };

  return (
    <>
      <Container className='header'>
        <Navbar className='header-topbar'>
          <Container className='header-item'>
            <Navbar.Brand className='header-brand' href='#'>
              {isDev ? 'Vatsim Flight Tracker Dev' : 'Vatsim Flight Tracker'}
            </Navbar.Brand>
          </Container>
          <Container className='header-item'>
            <Navbar.Text>Pilots connected: {pilotsCount}</Navbar.Text>
            <Navbar.Text>ATC connected: {atcCount}</Navbar.Text>
          </Container>
          <Container className='header-item'>
            <InputGroup className='d-flex'>
              <InputGroup.Text>CID / Callsign</InputGroup.Text>
              <Form.Control
                type='text'
                placeholder='1590612 / AUA546'
                onChange={changeInputValue}
              />
            </InputGroup>
            <Button
              variant='outline-primary'
              id='search-button'
              onClick={() => {
                onSearch(inputValue);
              }}
            >
              <i className='bi bi-search'></i>
            </Button>
          </Container>
        </Navbar>
      </Container>
    </>
  );
};

export default Header;
