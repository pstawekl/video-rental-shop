"use client"
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { DbUser } from "../../../utils/userUtils";
import { VideoTape } from "../../../utils/videoTapesUtils";
import Loading from "../../../components/Loading";
import { Button, Col, Row } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faClose } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VideoTapePage({ params }) {
    const router = useRouter();
    const { user, isLoading } = useUser();
    const [dbUser, setDbUser] = useState<DbUser>();
    const [isDbLoading, setIsDbLoading] = useState<boolean>(true);
    const [vTape, setVTape] = useState<VideoTape>();
    const [isOrdering, setIsOrdering] = useState<boolean>(false);
    const [isAvaible, setIsAvaible] = useState<boolean>(false);
    const [isOrdered, setIsOrdered] = useState<boolean>(false);
    const vtId: string = params.slug.split('-')[1];

    useEffect(() => {
        fetch('/api/mssql/orders/is-avaible', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ vtId: vtId })
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setIsAvaible(data.isAvaible);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    useEffect(() => {
        if (user) {
            fetch('/api/mssql/get-user-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user: user })
            })
                .then(response => response.json())
                .then(data => {
                    const userInfo: DbUser = data.userInfo;
                    setDbUser(userInfo);
                })
                .catch(error => console.error('Error:', error))
            console.log('dbuser', dbUser);
        }
    }, [user])

    useEffect(() => {
        fetch('/api/mssql/video-tapes/get-vt',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ vtId: vtId })
            })
            .then(response => response.json())
            .then(data => {
                const vt: VideoTape = data.videoTape[0];
                console.log(vt);
                setVTape(vt);
                setIsDbLoading(false);
            })
            .catch(error => {
                console.log(error);
            })
        console.log('vtape', vTape);
    }, [])

    function handleOrder() {
        if (user && isAvaible) {
            fetch('/api/mssql/orders/add-order',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ vtId: vtId, userId: user.sub, orderDate: todayDate, returnDate: datePlusSevenDays })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status == 200) {
                        setIsOrdered(true);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }

    const date: Date = new Date();
    function formatDate(date: Date) {
        const rok = date.getFullYear();
        const miesiac = String(date.getMonth() + 1).padStart(2, '0');
        const dzien = String(date.getDate()).padStart(2, '0');
        return `${rok}-${miesiac}-${dzien}`;
    }
    const todayDate = formatDate(date);
    const secondDate = new Date(date);
    secondDate.setDate(date.getDate() + 7);
    const datePlusSevenDays = formatDate(secondDate);

    if (vTape) {
        return (
            <>
                <Row>
                    {
                        isOrdered && <AfterOrder />
                    }
                </Row>
                <Row>
                    <Col xs='1'>
                        <FontAwesomeIcon onClick={() => router.back()} icon={faArrowLeft} style={{ fontSize: '2rem', cursor: 'pointer' }} />
                    </Col>
                    <Col>
                        <h3>{vTape.vt_name}</h3>
                    </Col>
                </Row>
                <Row>
                    <Col xs='12' md='6'>
                        <img src={'https://cdn.vectorstock.com/i/1000x1000/50/20/no-photo-or-blank-image-icon-loading-images-vector-37375020.webp'} alt={vTape.vt_name} style={{ width: '100%' }} />
                    </Col>
                    <Col xs='12' md='6' style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ display: 'flex', justifyContent: 'flex-end', minWidth: '100px', minHeight: '10px' }}>{vTape.vt_age_limits.length === 0 ? 'XYZ' : vTape.vt_age_limits}</span>
                        <p>Opis:</p>
                        <p>{vTape.vt_description}</p>
                        <span>Gatunek: {vTape.gn_name}</span>
                        <span>Reżyser: {vTape.vt_director}</span>
                        <span>Rok: {vTape.vt_year}</span>
                        <span>Długość: {vTape.vt_length}</span>
                        <span>Format: {vTape.vt_format}</span>
                        <span style={{ fontSize: '1.5rem' }}>Cena: xyz zł</span>
                        {
                            user && !isOrdering&& !isOrdered && <Button className="my-5" onClick={() => setIsOrdering(true)}>Chcę zamówić</Button>
                        }
                        {
                            user && isOrdering && <>
                                <Row>
                                    <Col>Wypożyczam od:</Col>
                                    <Col>{todayDate}</Col>
                                </Row>
                                <Row>
                                    <Col>Wypożyczam do:</Col>
                                    <Col>{datePlusSevenDays}</Col>
                                </Row>
                                <Button className="my-5" onClick={handleOrder} disabled={!isAvaible}>
                                    {isAvaible && !isOrdered ? 'Zamawiam' : 'Kaseta niedostępna'}
                                </Button>
                            </>

                        }
                        {
                            !user && <Link href="/api/auth/login"><Button className="my-5">Zaloguj się, aby zamówić</Button></Link>
                        }
                    </Col>
                </Row>
            </>
        )
    } else {
        return (
            <Loading />
        )
    }
}

function AfterOrder() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    if (isOpen) {
        return (
            <>
                <Row style={{ background: 'lightgreen', color: 'white' }}>
                    <Col></Col>
                    <Col>Dziękujemy za wypożyczenie kasety!</Col>
                    <Col>
                        <FontAwesomeIcon icon={faClose} onClick={() => setIsOpen(!isOpen)} />
                    </Col>
                </Row>
            </>
        )
    }
}