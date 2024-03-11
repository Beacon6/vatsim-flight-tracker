import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';

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
            <Navbar.Text>
              Pilots connected: {pilotsCount}
            </Navbar.Text>
            <Navbar.Text>
              ATC connected: {atcCount}
            </Navbar.Text>
          </Container>
          <Container className='header-container'>
            <Form className='d-flex'>
              <Form.Control type='text' placeholder='Placeholder' />
            </Form>
          </Container>
        </Navbar>
      </Container>
    </>
  );
};

export default Header;
