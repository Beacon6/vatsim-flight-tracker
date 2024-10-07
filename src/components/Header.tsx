import { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Navbar from "react-bootstrap/Navbar";

interface Props {
    pilotsCount?: number;
    controllersCount?: number;
    handleSearch: (input: string) => void;
}

function Header(props: Props) {
    const { pilotsCount, controllersCount, handleSearch } = props;

    const [searchValue, setSearchValue] = useState<string>("");

    useEffect(() => {
        if (sessionStorage.getItem("searchValue")) {
            const v = sessionStorage.getItem("searchValue");
            setSearchValue(v!);
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem("searchValue", searchValue);
    }, [searchValue]);

    function updateValue(input: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(input.target.value.toUpperCase());
    }

    return (
        <>
            <Container className="header">
                <Navbar className="header-topbar">
                    <Container className="header-item">
                        <Navbar.Brand className="header-brand" href="#">
                            {"Vatsim Flight Tracker"}
                        </Navbar.Brand>
                    </Container>
                    <Container className="header-item">
                        <Navbar.Text>Pilots connected: {pilotsCount}</Navbar.Text>
                        <Navbar.Text>ATC connected: {controllersCount}</Navbar.Text>
                    </Container>
                    <Container className="header-item">
                        <InputGroup className="d-flex">
                            <InputGroup.Text>CID / Callsign</InputGroup.Text>
                            <Form.Control type="text" value={searchValue} placeholder="Search" onChange={updateValue} />
                        </InputGroup>
                        <Button
                            variant="outline-primary"
                            id="search-button"
                            onClick={() => {
                                handleSearch(searchValue);
                            }}
                        >
                            <i className="bi bi-search"></i>
                        </Button>
                    </Container>
                </Navbar>
            </Container>
        </>
    );
}

export default Header;
