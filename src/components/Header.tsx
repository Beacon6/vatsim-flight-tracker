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
      <Container className='navbar-container'>
        <Navbar className='navbar'>
          <Container>
            <Navbar.Brand href='#'>VATSIM Flight Tracker</Navbar.Brand>
          </Container>
          <Container>
            <img src='../assets/flights-light.svg' height={32} width={32} />
            Pilots connected: {pilotsCount} |{' '}
            <img src='../assets/radar-light.svg' height={32} width={32} /> ATC
            connected: {atcCount}
          </Container>
          <Container>
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
