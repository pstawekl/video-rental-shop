"use client"
import Link from 'next/link';
import { Router } from 'next/router';
import react, { useEffect, useState } from "react";
import { Button, Col, Row, Spinner } from "reactstrap";
import { DbUser } from '../../utils/userUtils';
import { useUser } from '@auth0/nextjs-auth0/client';
import { VideoTape } from '../../utils/videoTapesUtils';

export default function VideoTapesList() {
    const { user, isLoading } = useUser();
    const [videoTapesList, setVideoTapesList] = useState<VideoTape[]>([]);
    const [dbUser, setDbUser] = useState<DbUser>();
    const [isDbLoading, setIsDbLoading] = useState<boolean>(true);

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
        }
    }, [user])

    useEffect(() => {
        fetch('/api/mssql/video-tapes/get-vt-list',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                const vtList: VideoTape[] = data.vtList[0];
                setVideoTapesList(vtList);
                setIsDbLoading(false);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    if (!isLoading && !isDbLoading) {
        return (
            <div>
                {
                    dbUser?.user_role_id === 1 && <div className="header"><Link href={'/add-vt'}><Button>Dodaj kasetę</Button></Link></div>
                }
                <h1>Lista kaset wideo:</h1>
                <Row className="video-list__video header py-2">
                    <Col className='video-list__title'>Tytuł</Col>
                    <Col className='video-list__genre'>Gatunek</Col>
                    <Col className='video-list__year'>Rok</Col>
                    <Col className='video-list__price'>Cena</Col>
                </Row>
                {
                    videoTapesList != null && videoTapesList.map((videoTape, index) => (
                        <Link href={"/vt-list/vt-" + videoTape?.vt_id} key={index} style={{ textDecoration: 'none', color: 'black' }}>
                            <Row className={"video-list__video"}>
                                <Col className='video-list__title'>{videoTape?.vt_name}</Col>
                                <Col className='video-list__genre'>{videoTape?.gn_name}</Col>
                                <Col className='video-list__year'>{videoTape?.vt_year}</Col>
                                <Col className='video-list__price'></Col>
                            </Row>
                        </Link>
                    ))
                }
            </div>
        )
    } else {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Spinner type="grow">
                    Loading...
                </Spinner>
            </div>
        )
    }
}