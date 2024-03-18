import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';

const Header: React.FC<{
  pilotsCount?: number;
  atcCount?: number;
}> = (props) => {
  const { pilotsCount, atcCount } = props;

  return (
    <>
      <Container className='header-container-main'>
        <Navbar className='header'>
          <Container className='header-container'>
            <Navbar.Brand href='#'>VATSIM Flight Tracker</Navbar.Brand>
          </Container>
          <Container className='header-container'>
            <Navbar.Text>Pilots connected: {pilotsCount}</Navbar.Text>
            <Navbar.Text>ATC connected: {atcCount}</Navbar.Text>
          </Container>
          <Container className='header-container'>
            <InputGroup className='d-flex'>
              <InputGroup.Text>CID / Callsign</InputGroup.Text>
              <Form.Control type='text' placeholder='1590612 / AUA546' />
              <Button variant='outline-success' id='search-button'>
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
